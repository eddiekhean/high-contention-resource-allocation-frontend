export default function BaseBox({ title, className, children }) {
  return (
    <div className={`box ${className}`}>
      <div className="title">{title}</div>
      {children}
    </div>
  );
}
