import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TextAnimation = ({
    text,
    as: Component = 'div',
    variants,
    classname,
    letterAnime = false,
    lineAnime = false,
    direction = 'up',
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10%' });

    // Base animation logic
    const defaultVariants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
            x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }
    };

    const finalVariants = variants || defaultVariants;

    // Render character by character
    if (letterAnime) {
        return (
            <Component ref={ref} className={classname} style={{ overflow: 'hidden' }}>
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={finalVariants}
                        transition={{
                            ...(finalVariants.visible.transition || {}),
                            delay: i * 0.02
                        }}
                        style={{ display: 'inline-block', whiteSpace: 'pre' }}
                    >
                        {char}
                    </motion.span>
                ))}
            </Component>
        );
    }

    // Render line by line (approximated by words for now)
    if (lineAnime) {
        return (
            <Component ref={ref} className={classname} style={{ overflow: 'hidden' }}>
                {text.split(' ').map((word, i) => (
                    <motion.span
                        key={i}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={finalVariants}
                        transition={{
                            ...(finalVariants.visible.transition || {}),
                            delay: i * 0.1
                        }}
                        style={{ display: 'inline-block', marginRight: '0.25em' }}
                    >
                        {word}
                    </motion.span>
                ))}
            </Component>
        );
    }

    // Default whole-text animation
    return (
        <div ref={ref} style={{ overflow: 'hidden' }}>
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={finalVariants}
                className={classname}
            >
                <Component>{text}</Component>
            </motion.div>
        </div>
    );
};

export default TextAnimation;
