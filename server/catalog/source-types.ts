export type SourceSection = {
  number: number
  title: string
  weight: number
  topics: Array<{ id: string; title: string; details: string }>
}

export type SourcePageValidators = {
  etag: string | null
  lastModified: string | null
}

export type CachedOfficialSources = {
  examGuide: { sections: SourceSection[]; validators: SourcePageValidators }
  learningPath: { activities: string[]; validators: SourcePageValidators }
}
