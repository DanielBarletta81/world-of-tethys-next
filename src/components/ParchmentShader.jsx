import { motion } from 'framer-motion';

export default function ParchmentShader({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0.95 }}
      animate={{ opacity: [0.95, 0.98, 0.95] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFeWqchAAAAHXRSTlMAEBAQERESExMUFRYXGBkaGxwdHh8gISIjJCYnKCkRFKdtAAAAhklEQVRIx52OORKDMAxE82+dJ3pD1/9T+YAg+J/F0+Wb/iX76i7u+17+d/GkX63c/vM0/tW1+jX74r76d/x7G+7R39/m/72D71J/9f/62+7/98/9C+7/9/x+9/+/x/9P/7gP9/9/w/9v/6D//gP///w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w/+/w=="), linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px, 50px 50px, 50px 50px',
          animation: 'flicker-overlay 5s infinite alternate ease-in-out, grain-shift 10s infinite linear',
          filter: 'contrast(1.1) brightness(0.98)'
        }}
      />
    </motion.div>
  );
}
