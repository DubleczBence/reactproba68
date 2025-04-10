import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { Box, Typography } from '@mui/material';

const TextCarousel = ({ messages }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevMessagesRef = useRef(messages);
  const [isChangingSet, setIsChangingSet] = useState(false);

  useEffect(() => {
    if (JSON.stringify(prevMessagesRef.current) !== JSON.stringify(messages)) {
      setIsChangingSet(true);
      setTimeout(() => {
        prevMessagesRef.current = messages;
        setIsChangingSet(false);
        setActiveIndex(0);
      }, 600);
    }
  }, [messages]);

  useEffect(() => {
    if (!isChangingSet) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 14000);
      
      return () => clearInterval(interval);
    }
  }, [messages.length, isChangingSet]);

  const carouselTransition = useSpring({
    opacity: isChangingSet ? 0 : 1,
    transform: isChangingSet ? 'translateY(30px)' : 'translateY(0)',
    config: { duration: 600 }
  });

  const [textProps, api] = useSpring(() => ({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { duration: 600 }
  }));

  useEffect(() => {
    if (!isChangingSet) {
      api.start({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(20px)' },
        reset: true
      });
    }
  }, [activeIndex, isChangingSet]);

  const getTextPosition = (index) => {
    if (!messages[index]) return { md: '40px', lg: '50px', xl: '60px' };
    
    const totalLength = messages[index].title.length + messages[index].subtitle.length;
    
    if (totalLength < 100) {
      return { md: '40px', lg: '50px', xl: '60px' };
    } 
    else if (totalLength < 150) {
      return { md: '20px', lg: '25px', xl: '30px' };
    } 
    else {
      return { md: '0px', lg: '0px', xl: '0px' };
    }
  };

  return (
    <animated.div style={carouselTransition}>
      <Box sx={{ 
        position: 'relative', 
        height: { md: '280px', lg: '300px', xl: '320px' }
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: getTextPosition(activeIndex),
          left: 0,
          right: 0,
          maxHeight: { md: '260px', lg: '280px', xl: '300px' },
          overflow: 'hidden'
        }}>
          <animated.div style={textProps}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold',
                mb: 2,
                fontSize: { md: '1.8rem', lg: '2.2rem', xl: '2.5rem' },
                color: theme => theme.palette.mode === 'light' ? '#003092' : 'inherit',
                wordWrap: 'break-word',
                hyphens: 'auto'
              }}
            >
              {messages[activeIndex]?.title || ''}
            </Typography>
            <Typography variant="h6" sx={{ 
                mt: 3,
                fontSize: { md: '0.85rem', lg: '0.95rem', xl: '1.1rem' },
                color: theme => theme.palette.mode === 'light' ? '#003092' : 'inherit',
                wordWrap: 'break-word',
                hyphens: 'auto'
              }}>
              {messages[activeIndex]?.subtitle || ''}
            </Typography>
          </animated.div>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          gap: 1 
        }}>
          {messages.map((_, index) => (
            <Box
              key={index}
              component="span"
              onClick={() => setActiveIndex(index)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: activeIndex === index 
                  ? theme => theme.palette.mode === 'light' ? '#003092' : '#90caf9'
                  : theme => theme.palette.mode === 'light' ? 'rgba(0, 48, 146, 0.3)' : 'rgba(144, 202, 249, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: activeIndex === index ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </Box>
      </Box>
    </animated.div>
  );
};

export default TextCarousel;