'use client';

import { Dispatch, useEffect, useRef } from 'react';
import { SetStateAction } from 'react';

import * as motion from 'motion/react-client';
import type { Variants } from 'motion/react';

interface PathProps {
    d?: string;
    variants: Variants;
    transition?: { duration: number };
}

const Path = (props: PathProps) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 18%)"
        strokeLinecap="round"
        {...props}
    />
);
const MenuToggle = ({ toggle }: { toggle: () => void }) => (
    <button
        style={toggleContainer}
        onClick={toggle}>
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <Path
                variants={{
                    closed: { d: 'M 2 2.5 L 20 2.5' },
                    open: { d: 'M 3 16.5 L 17 2.5' }
                }}
            />
            <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                variants={{
                    closed: { d: 'M 2 16.346 L 20 16.346' },
                    open: { d: 'M 3 2.5 L 17 16.346' }
                }}
            />
        </svg>
    </button>
);

const navVariants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
};
const Navigation = () => (
    <motion.ul
        className="absolute top-10 m-0 flex list-none flex-col p-6"
        variants={navVariants}>
        {['Menu', 'Rewards', 'Gift Cards'].map((item, index) => (
            <MenuItem
                item={item}
                key={index}
            />
        ))}
    </motion.ul>
);

const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 }
        }
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 }
        }
    }
};
const MenuItem = ({ item }: { item: string }) => {
    return (
        <motion.li
            style={listItem}
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}>
            <div style={{ ...textPlaceholder }}>{item}</div>
        </motion.li>
    );
};

const sidebarVariants = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
        transition: {
            type: 'spring',
            stiffness: 20,
            restDelta: 2
        }
    }),
    closed: {
        clipPath: 'circle(0px at 0px 0px)',
        transition: {
            delay: 0.2,
            type: 'spring',
            stiffness: 400,
            damping: 40
        }
    }
};

export default function HeaderMenu({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { height } = useDimensions(containerRef);

    return (
        <div>
            <div style={container}>
                <motion.nav
                    initial={false}
                    animate={isOpen ? 'open' : 'closed'}
                    custom={height}
                    ref={containerRef}
                    style={nav}>
                    <motion.div
                        style={background}
                        variants={sidebarVariants}
                    />
                    <Navigation />
                    <MenuToggle toggle={() => setIsOpen(!isOpen)} />
                </motion.nav>
            </div>
        </div>
    );
}

const container: React.CSSProperties = {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: 1,
    width: 300,
    maxWidth: '100%',
    height: 400,
    backgroundColor: 'var(--accent)',
    overflow: 'hidden',
    top: 75,
    right: 0
};

const nav: React.CSSProperties = {
    width: 300
};

const background: React.CSSProperties = {
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%'
};

const toggleContainer: React.CSSProperties = {
    outline: 'none',
    border: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    cursor: 'pointer',
    position: 'fixed',
    top: 13,
    right: 16,
    width: 24,
    height: 50,
    borderRadius: '50%',
    background: 'transparent'
};

const listItem: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    margin: 0,
    listStyle: 'none',
    marginBottom: 40,
    cursor: 'pointer'
};

const iconPlaceholder: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    flex: '40px 0',
    marginRight: 20
};

const textPlaceholder: React.CSSProperties = {
    fontSize: '20px',
    color: 'black'
};

/**
 * ==============   Utils   ================
 */

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
    const dimensions = useRef({ width: 0, height: 0 });

    useEffect(() => {
        if (ref.current) {
            dimensions.current.width = ref.current.offsetWidth;
            dimensions.current.height = ref.current.offsetHeight;
        }
    }, [ref]);

    return dimensions.current;
};