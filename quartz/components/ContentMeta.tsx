import { JSX } from "preact"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { formatDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: JSX.Element[] = []

      if (fileData.dates) {
        if (fileData.dates.created) {
          segments.push(<span>Created on {formatDate(fileData.dates.created!, cfg.locale)}</span>)
          segments.push(<span>|</span>)
        }

        if (fileData.dates.modified) {
          segments.push(<span>Updated on {formatDate(fileData.dates.modified!, cfg.locale)}</span>)
          segments.push(<span>|</span>)
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { text: timeTaken, words: _words } = readingTime(text)
        segments.push(<span>{timeTaken}</span>)
      }

      // return <p class={classNames(displayClass, "content-meta")}>{segments.join(" | ")}</p>
      return (
        <p class={classNames(displayClass, "content-meta")}>
          {segments.map((meta, idx) => (
            <>
              {meta}
              {idx < segments.length - 1 ? <br /> : null}
            </>
          ))}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = `
  .content-meta {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 10;
    
    margin-top: 0;
    color: var(--gray);
  }
  `
  return ContentMetadata
}) satisfies QuartzComponentConstructor
