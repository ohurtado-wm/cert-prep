import type { CertificationCatalogItem, CertificationGuideResponse, Locale } from '@cert-prep/contracts/certification-contracts'
import { translate } from '../i18n/messages'
import { guideErrorMessage } from '../i18n/error-messages'
import { GuideDescription } from './GuideDescription'

export function ResourcesScreen({ locale, certification, guide, guideLoading, guideError, onGuideRetry }: {
  locale: Locale
  certification: CertificationCatalogItem
  guide: CertificationGuideResponse | undefined
  guideLoading: boolean
  guideError: unknown
  onGuideRetry: () => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const domains = guide?.domains ?? []
  const sourceLabels = {
    'exam-guide': text('sourceExamGuide'),
    'exam-details': text('sourceExamDetails'),
    certification: text('sourceCertification'),
    'learning-path': text('sourceLearningPath'),
  }
  return (
    <section className="topics-section" aria-labelledby="topics-title">
        {guideLoading && <p role="status">{text('guideLoading')}</p>}
        {Boolean(guideError) && <div role="alert"><p>{guideErrorMessage(locale, guideError)}</p><button type="button" className="button button-secondary" onClick={onGuideRetry}>{text('guideRetry')}</button></div>}
        {guide && !guideError && <p className="section-intro">{text('guideVersion', { version: guide.version })} · {text('aiRefreshed')}: {formatDate(guide.freshness.aiRefreshedAt, locale)}{guide.freshness.sourceCheckedAt && <> · {text('guideSourcesChecked')}: {formatDate(guide.freshness.sourceCheckedAt, locale)}</>}</p>}
        <div className="section-heading">
          <div>
            <p className="eyebrow">{text('examMapEyebrow')}</p>
            <h2 id="topics-title">{text('examMapTitle')}</h2>
          </div>
          {certification.sources.find((source) => source.kind === 'exam-guide') && <a className="text-link" href={certification.sources.find((source) => source.kind === 'exam-guide')!.url} target="_blank" rel="noreferrer">
            {text('officialGuide')} <span aria-hidden="true">↗</span>
          </a>}
        </div>

        {domains.length > 0 ? (
          <div className="topic-grid">
            {domains.map((domain) => (
              <TopicCard
                key={domain.id}
                domain={domain}
                locale={locale}
              />
            ))}
          </div>
        ) : <p className="guide-empty">{text('noTopics')}</p>}

        {guide && <section className="study-path-section" aria-labelledby="study-path-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{text('studyPathEyebrow')}</p>
              <h2 id="study-path-title">{text('studyPathTitle')}</h2>
              <p className="section-intro">{text('studyPathIntro')}</p>
            </div>
          </div>
          {guide.studyPath.length > 0 ? <ol className="study-path-list">
            {guide.studyPath.map((step, index) => {
              const stepTitle = step.title[locale].replace(/^\s*\d+[.)]\s+/, '')
              return <li className="study-path-card" key={step.id}>
                <div>
                  <p className="eyebrow study-path-step">{text('step', { number: String(index + 1).padStart(2, '0') })}</p>
                  <h3>{stepTitle}</h3>
                  <GuideDescription text={step.description[locale]} />
                  <div className="study-path-domains">
                    <span>{text('domainsInStep')}:</span>
                    <ul>
                      {step.domainIds.map((domainId) => guide.domains.find((domain) => domain.id === domainId)?.name[locale])
                        .filter((name): name is string => Boolean(name))
                        .map((name) => <li key={name}>{name}</li>)}
                    </ul>
                  </div>
                  <a className="text-link" href={step.url} target="_blank" rel="noreferrer" aria-label={`${text('openResource')}: ${stepTitle}`}>
                    {text('openResource')} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            })}
          </ol> : <p className="guide-empty">{text('noStudyPath')}</p>}
        </section>}

        {guide && <section className="official-sources" aria-labelledby="official-sources-title">
          <h2 id="official-sources-title">{text('officialSourcesTitle')}</h2>
          <ul>
            {guide.sources.map((source) => (
              <li key={source.url}>
                <span>{sourceLabels[source.kind]}</span>
                <a className="text-link" href={source.url} target="_blank" rel="noreferrer">
                  {source.title} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          {guide.researchSources.length > 0 && <>
            <h3>{text('guideResearchSourcesTitle')}</h3>
            <ul>
              {guide.researchSources.map((source) => (
                <li key={source.url}>
                  <a className="text-link" href={source.url} target="_blank" rel="noreferrer">
                    {source.title} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </>}
        </section>}
      </section>
  )
}

function TopicCard({
  domain,
  locale,
}: {
  domain: CertificationGuideResponse['domains'][number]
  locale: Locale
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)

  return (
    <details className="topic-card">
      <summary className="topic-summary">
        <span className="topic-summary-content">
          <span className="topic-name">{domain.name[locale]}</span>
          <span className="topic-summary-meta">{text('domainTopics')} · {text('coveredTopicsCount', { count: domain.topics.length })}</span>
        </span>
        <span className="topic-summary-weight">
          <span className="topic-weight">{domain.weightRange && domain.weightRange.min !== domain.weightRange.max
            ? `${formatWeight(domain.weightRange.min, locale)}–${formatWeight(domain.weightRange.max, locale)}%`
            : `${formatWeight(domain.weightRange?.min ?? domain.weight, locale)}%`}</span>
          <span className="topic-weight-label">{text('approximateExamWeight')}</span>
        </span>
        <span className="topic-disclosure" aria-hidden="true">⌄</span>
      </summary>
      <div className="topic-details">
        <GuideDescription text={domain.description[locale]} />
        <ul className="domain-topic-list">
          {domain.topics.map((topic) => <li key={topic.id}>{topic.name[locale]}</li>)}
        </ul>
      </div>
    </details>
  )
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es' : 'en-US', { dateStyle: 'medium' }).format(new Date(value))
}

function formatWeight(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)
}
