import useScrollReveal from '../hooks/useScrollReveal'

export default function Reveal({ as: Tag = 'div', index = 0, className = '', style, children, ...rest }) {
  const [ref, visible] = useScrollReveal()
  return (
    <Tag
      ref={ref}
      data-visible={visible}
      className={`reveal ${className}`}
      style={{ '--i': index, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
