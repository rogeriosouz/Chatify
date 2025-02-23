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
    return (
      <p
        style={{
          color: '#317cf7',
        }}
        className="text-sm z-[999] font-normal"
      >
        {str}
      </p>
    )
  } else if (isURL(str)) {
    return (
      <a
        href={str}
        target="_blank"
        style={{
          textDecoration: 'underline',
          color: '#317cf7',
        }}
        className="text-sm z-[999] font-normal"
        rel="noreferrer"
      >
        {str}
      </a>
    )
  } else {
    return <p className="text-sm z-[999] font-normals text-black">{str}</p>
  }
}
