import React from 'react';

const PhoneNumberAndAddress = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',                        // allow wrapping on narrow screens
                gap: '30%',                              // 2% of viewport width between items
                fontSize: 'calc(1.5rem + 0.5vw)',        // base 1.5rem + scale with viewport
                margin: 'auto',
                textAlign: 'center',
            }}
        >
            <span>(916) 278-6011</span>
            <span>6000 J Street, Sacramento, CA, 95819, United States</span>
        </div>
    );
};

export default PhoneNumberAndAddress;