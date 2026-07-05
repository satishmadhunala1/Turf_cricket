import { motion } from 'framer-motion';

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.08 } },
  },
};

export const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-50px' }}
    custom={delay}
    variants={variants.fadeUp}
    className={className}
  >
    {children}
  </motion.div>
);

export const PageTransition = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const HoverLift = ({ children, className = '' }) => (
  <motion.div
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className={className}
  >
    {children}
  </motion.div>
);

export default variants;
