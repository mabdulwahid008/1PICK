export const portfolioStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      padding: '4px 0px 4px 10px',
      fontFamily: 'inter',
      boxShadow: 'none',
      cursor: 'pointer',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#F4F4F4' : 'white',
      color: state.isSelected ? 'black' : 'black',
      padding: '12px 29px 12px 19px',
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: 'inter',
      borderBottom: '1px solid #ced4da',
      borderTop: 'none',
      marginBottom: '0',
      marginTop: '0',
      '&:hover': {
        backgroundColor: '#F4F4F4',
        color: 'black'
      }
    }),
    menu: (provided, state) => ({
      ...provided,
      background: 'transparent',
      boxShadow: 'none',
    }),
    menuList: (provided, state) => ({
      ...provided,
      padding: '0',
      marginTop: '0',
      marginBottom: '0',
      borderRadius: '4px',
      border: '1px solid #ced4da', // Add borderTop to the menuList
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transition: 'transform 0.3s', // Add transition for smooth rotation effect
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null, // Rotate the arrow when menu is open
      color: '#00B66D'
    })
};

export const portfolioMobStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      padding: '0px',
      minHeight: '18px',
      fontSize: '6px',
      fontFamily: 'inter',
      boxShadow: 'none',
      cursor: 'pointer',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#F4F4F4' : 'white',
      color: state.isSelected ? 'black' : 'black',
      padding: '6px 0px 6px 8px',
      fontSize: '6px',
      cursor: 'pointer',
      fontFamily: 'inter',
      borderBottom: '1px solid #ced4da',
      borderTop: 'none',
      marginBottom: '0',
      marginTop: '0',
      '&:hover': {
        backgroundColor: '#F4F4F4',
        color: 'black'
      }
    }),
    menu: (provided, state) => ({
      ...provided,
      background: 'transparent',
      boxShadow: 'none',
    }),
    menuList: (provided, state) => ({
      ...provided,
      padding: '0',
      marginTop: '0',
      marginBottom: '0',
      borderRadius: '2px',
      border: '1px solid #ced4da', // Add borderTop to the menuList
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transition: 'transform 0.3s', // Add transition for smooth rotation effect
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null, // Rotate the arrow when menu is open
      color: '#00B66D',
      padding : '0px 5px',
      fontSize: '6px',
      height: '20px',
      width: '25px'
    })
};


export const createEvent = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      padding: '10px 0px 10px 15px',
      color: '##9A9AB0',
      fontFamily: 'inter',
      boxShadow: 'none',
      cursor: 'pointer',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#F4F4F4' : 'white',
      color: state.isSelected ? 'black' : 'black',
      padding: '12px 29px 12px 19px',
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: 'inter',
      borderBottom: '1px solid #ced4da',
      borderTop: 'none',
      marginBottom: '0',
      marginTop: '0',
      '&:hover': {
        backgroundColor: '#F4F4F4',
        color: 'black'
      }
    }),
    menu: (provided, state) => ({
      ...provided,
      background: 'transparent',
      boxShadow: 'none',
    }),
    menuList: (provided, state) => ({
      ...provided,
      padding: '0',
      marginTop: '0',
      marginBottom: '0',
      borderRadius: '4px',
      border: '1px solid #ced4da', // Add borderTop to the menuList
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transition: 'transform 0.3s', // Add transition for smooth rotation effect
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null, // Rotate the arrow when menu is open
      color: '#00B66D'
    })
};
export const createMobEvent = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      padding: '0px 0px 0px 8px',
      color: '##9A9AB0',
      fontFamily: 'inter',
      boxShadow: 'none',
      fontSize: '10px',
      cursor: 'pointer',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#F4F4F4' : 'white',
      color: state.isSelected ? 'black' : 'black',
      padding: '12px 29px 12px 19px',
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: 'inter',
      borderBottom: '1px solid #ced4da',
      borderTop: 'none',
      marginBottom: '0',
      marginTop: '0',
      '&:hover': {
        backgroundColor: '#F4F4F4',
        color: 'black'
      }
    }),
    menu: (provided, state) => ({
      ...provided,
      background: 'transparent',
      boxShadow: 'none',
    }),
    menuList: (provided, state) => ({
      ...provided,
      padding: '0',
      marginTop: '0',
      marginBottom: '0',
      borderRadius: '4px',
      border: '1px solid #ced4da', // Add borderTop to the menuList
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transition: 'transform 0.3s', // Add transition for smooth rotation effect
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null, // Rotate the arrow when menu is open
      // color: '#00B66D'
      padding: '0px',
      width: '15px',
      height: '18px'
    })
};



export const mobEventFilter = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      padding: '0px 0px 0px 0px',
      color: '##9A9AB0',
      fontFamily: 'inter',
      boxShadow: 'none',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      background: '#F0F0F0',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#F4F4F4' : 'white',
      color: state.isSelected ? 'black' : 'black',
      padding: '12px 29px 12px 19px',
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: 'inter',
      borderBottom: '1px solid #ced4da',
      borderTop: 'none',
      marginBottom: '0',
      marginTop: '0',
      '&:hover': {
        backgroundColor: '#F4F4F4',
        color: 'black'
      }
    }),
    menu: (provided, state) => ({
      ...provided,
      background: 'transparent',
      boxShadow: 'none',
    }),
    menuList: (provided, state) => ({
      ...provided,
      padding: '0',
      marginTop: '0',
      marginBottom: '0',
      borderRadius: '4px',
      border: '1px solid #ced4da', // Add borderTop to the menuList
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transition: 'transform 0.3s', // Add transition for smooth rotation effect
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null, // Rotate the arrow when menu is open
      color: '##9A9AB0',
      marginRight: 15,
      padding: '0px',
      width: '15px',
      height: '18px'
    })
};