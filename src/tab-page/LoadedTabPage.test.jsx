import React from 'react';
import { Factory } from 'rosie';
import { initializeTestStore, render, screen } from '../setupTest';
import LoadedTabPage from './LoadedTabPage';

/* eslint-disable react/prop-types */
jest.mock('../course-tabs/CourseTabsNavigation', () => function ({ tabs }) {
  return (
    <div data-testid="CourseTabsNavigation">
      {tabs.map(({ slug, title, url }) => <a key={slug} href={url}>{title}</a>)}
    </div>
  );
});
/* eslint-enable react/prop-types */
jest.mock('../instructor-toolbar/InstructorToolbar', () => function () {
  return <div data-testid="InstructorToolbar" />;
});
jest.mock('../shared/streak-celebration/StreakCelebrationModal', () => function () {
  return <div data-testid="StreakModal" />;
});
jest.mock('../product-tours/ProductTours', () => function () {
  return <div data-testid="ProductTours" />;
});

describe('Loaded Tab Page', () => {
  const mockData = { activeTabSlug: 'courseware', metadataModel: 'coursewareMeta' };

  beforeAll(async () => {
    const store = await initializeTestStore({ excludeFetchSequence: true });
    mockData.courseId = store.getState().courseware.courseId;
  });

  it('renders correctly', () => {
    render(<LoadedTabPage {...mockData} />);

    expect(screen.queryByTestId('CourseTabsNavigation')).toBeInTheDocument();
    expect(screen.queryByTestId('InstructorToolbar')).not.toBeInTheDocument();
  });

  it('shows Instructor Toolbar if original user is staff', async () => {
    const courseMetadata = Factory.build('courseMetadata');
    const courseHomeMetadata = Factory.build('courseHomeMetadata', { original_user_is_staff: true });
    const testStore = await initializeTestStore(
      {
        courseMetadata,
        courseHomeMetadata,
        excludeFetchSequence: true,
      },
      false,
    );
    render(<LoadedTabPage {...mockData} courseId={courseMetadata.id} />, { store: testStore });

    expect(screen.getByTestId('InstructorToolbar')).toBeInTheDocument();
  });

  it('hides the Dates tab and adds a Bookmark tab last', () => {
    render(<LoadedTabPage {...mockData} />);

    const links = screen.getAllByRole('link');
    expect(screen.queryByRole('link', { name: 'Dates' })).not.toBeInTheDocument();
    expect(links[links.length - 1]).toHaveTextContent('Bookmark');
    expect(links[links.length - 1]).toHaveAttribute(
      'href',
      `http://localhost:18000/courses/${mockData.courseId}/bookmarks/`,
    );
  });

  it('shows streak celebration modal', async () => {
    const courseMetadata = Factory.build('courseMetadata', { celebrations: { streakLengthToCelebrate: 3 } });
    const testStore = await initializeTestStore({ courseMetadata }, false);
    render(<LoadedTabPage {...mockData} courseId={courseMetadata.id} />, { store: testStore });
    expect(screen.getByTestId('StreakModal')).toBeInTheDocument();
  });
});
