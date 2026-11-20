interface MonogramProps {
  size?: number;
  className?: string;
}

export const Monogram = ({ size = 28, className }: MonogramProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect
      x="0.75"
      y="0.75"
      width="34.5"
      height="34.5"
      rx="3.25"
      fill="#080808"
      stroke="#242424"
      strokeWidth="1.2"
    />
    <path
      d="M16.2 12.2C15.05 11.3 13.65 10.8 12.15 10.8C8.35 10.8 5.6 13.75 5.6 18C5.6 22.25 8.35 25.2 12.15 25.2C13.65 25.2 15.05 24.7 16.2 23.8"
      stroke="#F4F2EE"
      strokeWidth="1.65"
      strokeLinecap="square"
    />
    <path
      d="M20.4 11.4H29.2M20.4 18H27.4M20.4 24.6H29.2M20.4 11.4V24.6"
      stroke="#F4F2EE"
      strokeWidth="1.65"
      strokeLinecap="square"
    />
    <circle cx="30.2" cy="7.8" r="1.5" fill="#B89A6A" />
  </svg>
);

export default Monogram;
