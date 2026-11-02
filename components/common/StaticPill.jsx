export default function StaticPill({ text }) {
  return (
    <div style={{ display: 'flex', marginBottom: '16px' }}>
      <div 
        className="scrolling-title" 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 24px',
          border: '1px solid rgb(0, 140, 255)', /* Subtle border */
          borderRadius: '9999px', /* Pill shape */
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontSize: '12px',
          fontWeight: '700',
          color: 'rgb(0, 140, 255)',
          fontSize: '11px',  
          height: '32px',
          backgroundColor: 'transparent'
        }}
      >
        <span>{text}</span>
      </div>
    </div>
  );
}