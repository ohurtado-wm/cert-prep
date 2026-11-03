import { z } from 'zod'

const AnswerSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  isCorrect: z.boolean(),
})

const QuestionSchema = z.object({
  id: z.string().min(1),
  topicId: z.string().min(1),
  focus: z.string().min(1),
  service: z.string().min(1),
  question: z.string().min(1),
  answers: z.array(AnswerSchema).length(4),
  explanation: z.string().min(1),
})

const TopicSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  weight: z.number().int().positive(),
})

const CertificationSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    language: z.enum(['es', 'en']),
    source: z.string().url(),
    topics: z.array(TopicSchema).length(4),
    questions: z.array(QuestionSchema).length(20),
  })
  .superRefine((certification, context) => {
    const topicIds = new Set(certification.topics.map((topic) => topic.id))
    const questionIds = new Set<string>()
    const domainCounts = new Map<string, number>()

    if (certification.topics.reduce((sum, topic) => sum + topic.weight, 0) !== 100) {
      context.addIssue({ code: 'custom', message: 'Los pesos de los temas deben sumar 100.' })
    }

    certification.questions.forEach((question, questionIndex) => {
      if (questionIds.has(question.id)) {
        context.addIssue({
          code: 'custom',
          path: ['questions', questionIndex, 'id'],
          message: 'El identificador de la pregunta está repetido.',
        })
      }
      questionIds.add(question.id)

      if (!topicIds.has(question.topicId)) {
        context.addIssue({
          code: 'custom',
          path: ['questions', questionIndex, 'topicId'],
          message: 'La pregunta referencia un tema inexistente.',
        })
      }
      domainCounts.set(question.topicId, (domainCounts.get(question.topicId) ?? 0) + 1)

      if (question.answers.filter((answer) => answer.isCorrect).length !== 1) {
        context.addIssue({
          code: 'custom',
          path: ['questions', questionIndex, 'answers'],
          message: 'Cada pregunta debe tener exactamente una respuesta correcta.',
        })
      }
    })

    if (certification.id === 'gcp-professional-cloud-developer') {
      const expectedCounts: Record<string, number> = {
        design: 7,
        build_test: 5,
        deploy: 4,
        integrate: 4,
      }

      for (const [topicId, expected] of Object.entries(expectedCounts)) {
        if (!topicIds.has(topicId) || domainCounts.get(topicId) !== expected) {
          context.addIssue({
            code: 'custom',
            path: ['questions'],
            message: `Se esperan ${expected} preguntas para el tema ${topicId}.`,
          })
        }
      }
    }
  })

export const CertificationCollectionSchema = z.object({
  certifications: z.array(CertificationSchema).min(1),
})

export type Certification = z.infer<typeof CertificationSchema>
export type CertificationTopic = Certification['topics'][number]
export type CertificationQuestion = Certification['questions'][number]
export type AnswerOption = CertificationQuestion['answers'][number]
