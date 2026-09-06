import PropTypes from 'prop-types';

import completedIcon from '../icons/completed.png';
import incompleteIcon from '../icons/incomplete.png';

export const UNIT_ICON_TYPES = {
  lock: 'lock',
};

const UnitIcon = ({ isCompleted, ...props }) => {
  const icon = isCompleted ? completedIcon : incompleteIcon;

  return (
    <img
      src={icon}
      alt=""
      width={16}
      height={16}
      {...props}
    />
  );
};

UnitIcon.propTypes = {
  isCompleted: PropTypes.bool.isRequired,
};

export default UnitIcon;