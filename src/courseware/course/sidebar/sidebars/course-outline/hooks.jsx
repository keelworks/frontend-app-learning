import { useContext, useState } from 'react';

import { useSelector } from 'react-redux';

import { useModel } from '@src/generic/model-store';

import SidebarContext from '@src/courseware/course/sidebar/SidebarContext';

import { getCoursewareOutlineSidebarSettings } from '@src/courseware/data/selectors';

import { ID } from './constants';

export const useCourseOutlineSidebar = () => {
  const { enableNavigationSidebar: isEnabledSidebar } = useSelector(
    getCoursewareOutlineSidebarSettings,
  );

  const {
    unitId,
    courseId,
    currentSidebar,
    toggleSidebar,
    shouldDisplayFullScreen,
  } = useContext(SidebarContext);

  const isOpenSidebar = false;

  const [isOpen, setIsOpen] = useState(false);

  const course = useModel('coursewareMeta', courseId);

  const {
    entranceExamEnabled,
    entranceExamPassed,
  } = course.entranceExamData || {};

  const isActiveEntranceExam = entranceExamEnabled && !entranceExamPassed;

  const handleToggleCollapse = () => {
    if (currentSidebar === ID) {
      toggleSidebar(null);
      window.sessionStorage.setItem('hideCourseOutlineSidebar', 'true');
    } else {
      toggleSidebar(ID);
      window.sessionStorage.removeItem('hideCourseOutlineSidebar');
    }
  };

  return {
    courseId,
    unitId,
    currentSidebar,
    shouldDisplayFullScreen,
    isEnabledSidebar,
    isOpen,
    setIsOpen,
    handleToggleCollapse,
    isActiveEntranceExam,
  };
};