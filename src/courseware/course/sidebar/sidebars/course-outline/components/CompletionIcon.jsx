import PropTypes from 'prop-types';

import completedIcon from '../icons/completed.png';
import incompleteIcon from '../icons/incomplete.png';

const CompletionIcon = ({ completionStat: { completed = 0, total = 0 } }) => {
  const isCompleted = total !== 0 && completed === total;
  const isIncomplete = completed === 0;

  const icon = isCompleted ? completedIcon : incompleteIcon;
  return (
    <img
      src={icon}
      alt=""
      width="16"
      height="16"
    />
  );
};

CompletionIcon.propTypes = {
  completionStat: PropTypes.shape({
    completed: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
};

export default CompletionIcon;