export const formatSignal = (signal: string): string => {
  const map: Record<string, string> = {
    new_multi_source: "New across multiple sources",
  }

  if (map[signal]) return map[signal]
  if (signal.startsWith("multi_source_"))
    return `Detected in ${signal.replace("multi_source_", "")} sources`
  if (signal.startsWith("spike_")) return `${signal.replace("spike_", "")} mention spike`

  return signal.replace(/_/g, " ")
}
