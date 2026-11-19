import { generateText } from 'ai'
import { createAiModel } from '../../ai/model-provider'
import { AI_REQUEST_TIMEOUT_MS } from '../../ai/request-timeout'
import type { BankQuestion } from './bank'

export type ExplanationGenerator = (question: BankQuestion) => Promise<string>

export const generateBankExplanation: ExplanationGenerator = async (question) => {
  const result = await generateText({
    model: createAiModel(),
    prompt: [
      'In English, briefly explain why the supplied answer is correct for this practice question. Do not invent facts or claim the question is official. Return only the explanation.',
      `Question: ${question.question}`,
      `Correct answer: ${question.answers[question.correctAnswerIndex]}`,
    ].join('\n\n'),
    maxOutputTokens: 400,
    maxRetries: 0,
    abortSignal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
    providerOptions: { openai: { store: false } },
  })
  const explanation = result.text.trim()
  if (!explanation || explanation.length > 3000) throw new Error('Invalid explanation')
  return explanation
}
