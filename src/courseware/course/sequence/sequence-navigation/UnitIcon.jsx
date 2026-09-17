import PropTypes from 'prop-types';

import completedIcon from '../../sidebar/sidebars/course-outline/icons/completed.png';
import incompleteIcon from '../../sidebar/sidebars/course-outline/icons/incomplete.png';

const UnitIcon = ({ isCompleted }) => {
  const icon = isCompleted ? completedIcon : incompleteIcon;

  return (
    <img
      className="unit-icon"
      src={icon}
      alt=""
      width="24"
      height="24"
    />
  );
};

UnitIcon.propTypes = {
  isCompleted: PropTypes.bool.isRequired,
};

export default UnitIcon;