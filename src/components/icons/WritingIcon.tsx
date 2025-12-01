// src/components/icons/WritingIcon.tsx
const WritingIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="48"
    height="48"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z" />
    <path d="M16 7h4" />
    <path d="M18 19h-13a2 2 0 1 1 0 -4h13a2 2 0 1 1 0 4z" />
  </svg>
);

export default WritingIcon;
