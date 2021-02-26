import './TabsList.css';
import { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabContent from '../TabContent/TabContent';

//basic data
const tabsArr = [
  {
    id: 1,
    selected: true,
  },
  {
    id: 2,
    selected: false,
  },
  {
    id: 3,
    selected: false,
  },
];

const TabsList = () => {
  //to get current position of scroll
  const [currentScrollPos, setCurrentScrollPos] = useState(0);
  // to get current selected tab
  const [currentSelectedTab, setCurrentSelectedTab] = useState(1);
  //Tabs data array of objects
  const [tabsArray, setTabsArray] = useState(tabsArr);

  // tabs-list dom reference
  const tabsListRef = useRef('');

  // move scroll by 150px
  const move = 150;

  // Left arrow click
  const handleLeftArrowClick = () => {
    if (tabsListRef) {
      tabsListRef.current.scrollLeft -= move;
    }
  };

  // Right arrow click
  const handleRightArrowClick = () => {
    if (tabsListRef) {
      tabsListRef.current.scrollLeft += move;
    }
  };

  // Select the tab by clicking on
  const handleTabClick = (id) => {
    const tabsArr = tabsArray.map((tab) => {
      if (tab.selected) tab.selected = false;

      if (tab.id === id) tab.selected = true;
      return tab;
    });
    setTabsArray(tabsArr);
    setCurrentSelectedTab(id);
  };

  // hide left arrow when first item visible
  const hideLeftArrow = currentScrollPos === 0 ? true : false;

  // hide right arrow when last item visible
  const totalTabsListWidth = tabsListRef ? tabsListRef.current.scrollWidth : 0;
  const totalTabsListOffsetWidth = tabsListRef
    ? tabsListRef.current.offsetWidth
    : 0;
  let totalWidth = totalTabsListWidth - totalTabsListOffsetWidth;
  totalWidth = isNaN(totalWidth) ? 0 : totalWidth;
  const hideRightArrow =
    currentScrollPos === totalWidth || totalWidth - currentScrollPos < 5
      ? true
      : false;

  // Add more tabs and max 10 tabs are allowed to create
  const handleAddTabs = () => {
    if (tabsListRef) {
      tabsListRef.current.scrollLeft = tabsListRef.current.scrollWidth;
    }
    if (tabsArray.length === 10) {
      notify('Max 10 tabs allowed to create');
      return false;
    }

    const tabsArr = tabsArray.map((tab) => {
      if (tab.selected) tab.selected = false;
      return tab;
    });

    const prevId =
      tabsArray[tabsArray.length - 1] && tabsArray[tabsArray.length - 1].id;

    const newTab = { id: prevId + 1, selected: true };
    tabsArr.push(newTab);

    setTabsArray(tabsArr);
    if (tabsListRef) {
      tabsListRef.current.scrollLeft += 200;
    }
    setCurrentSelectedTab(newTab.id);
  };

  // Remove tabs - only non selected tabs can be removed
  const handleRemoveTab = (e, id) => {
    e.stopPropagation();
    const filterTabsArr = tabsArray.filter((tab) => tab.id !== id);
    setTabsArray(filterTabsArr);
    notify(`Tab ${id} removed`);
  };

  //Toast message - displays at bottom right position
  const notify = (message) =>
    toast.info(message, {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <>
      <div className="tabs-list__container">
        {/* Left arrow */}
        <div
          className={`${
            hideLeftArrow ? 'hidden ' : ''
          } left-tab-list__angle tab-list__angle `}
          onClick={handleLeftArrowClick}
        >
          &lt;
        </div>

        {/* Tab list */}
        <ul
          className="tabs-list"
          ref={tabsListRef}
          onScroll={(e) => setCurrentScrollPos(e.target.scrollLeft)}
        >
          {tabsArray.map((tab, index) => (
            <li
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`${
                tab.selected ? 'tabs-list__item-active' : ''
              } tabs-list__item  `}
            >
              {!tab.selected ? (
                <span
                  className="remove__tab"
                  onClick={(e) => handleRemoveTab(e, tab.id)}
                >
                  x
                </span>
              ) : (
                ''
              )}
              <span>Tab {tab.id}</span>
            </li>
          ))}
        </ul>

        {/* Right Arrow */}
        <div
          className={`${
            hideRightArrow ? 'hidden ' : ''
          } right-tab-list__angle tab-list__angle `}
          onClick={handleRightArrowClick}
        >
          &gt;
        </div>

        {/* Add tabs */}
        <div className="plus-tab-list tab-list__angle" onClick={handleAddTabs}>
          &#43;
        </div>
      </div>

      {/* To dispay tab content */}
      <TabContent id={currentSelectedTab} />

      {/* Toast init */}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default TabsList;
