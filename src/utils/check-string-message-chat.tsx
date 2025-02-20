/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
function isNumeric(str: string) {
  return /^[0-9]+$/.test(str)
}

function isURL(str: string) {
  try {
    new URL(str)
    return true
  } catch (_) {
    return false
  }
}

export function CheckStringType({ str }: { str: string }) {
  if (isNumeric(str)) {
    return <p className="text-sm z-[999] font-medium text-blue-700">{str}</p>
  } else if (isURL(str)) {
    return (
      <a
        href={str}
        target="_blank"
        className="text-sm z-[999] hover:text-blue-600 font-medium transition-all text-blue-700 underline"
        rel="noreferrer"
      >
        {str}
      </a>
    )
  } else {
    return <p className="text-sm z-[999] font-normals">{str}</p>
  }
}
