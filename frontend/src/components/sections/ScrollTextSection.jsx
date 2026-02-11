import React from 'react';
import TextAnimation from '@/components/ui/scroll-text';
import './ScrollTextSection.css';

const ScrollTextSection = ({ data }) => {
    // If data exists, we can use it, but for this implementation we'll follow the user's specific demo layout
    return (
        <div className="scroll-text-section">
            <div className="demo-hero">
                <h1 className="demo-hero-title">Scroll Down👇</h1>
            </div>

            <div className="demo-block center">
                <TextAnimation
                    text='Creative ideas start here.'
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                            filter: 'blur(0px)',
                            opacity: 1,
                            y: 0,
                            transition: { ease: 'linear' },
                        },
                    }}
                    classname="demo-text capitalize"
                />
            </div>

            <div className="demo-block left">
                <TextAnimation
                    as="p"
                    letterAnime={true}
                    text="Let's team up and turn ideas into reality ✨"
                    classname="demo-text lowercase"
                    variants={{
                        hidden: { filter: 'blur(4px)', opacity: 0, y: 20 },
                        visible: {
                            filter: 'blur(0px)',
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.2,
                            },
                        },
                    }}
                />
            </div>

            <div className="demo-block right">
                <TextAnimation
                    text='Turning concepts into reality'
                    direction='right'
                    classname="demo-text capitalize"
                />
            </div>

            <div className="demo-block center">
                <TextAnimation
                    text='Dream big, work hard & achieve greatness '
                    direction='down'
                    lineAnime={true}
                    classname="demo-text capitalize"
                />
            </div>
        </div>
    );
};

export default ScrollTextSection;
