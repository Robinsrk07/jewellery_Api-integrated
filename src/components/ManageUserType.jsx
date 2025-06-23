import { useSelector } from "react-redux";


const ManageByCreatorPermission = ({ action, createdByType, children, fallback = null }) => {
  const {
    is_superadmin,
    manage_user_type,
    can_manage_user_types = {},
  } = useSelector((store) => store.auth);

  if (is_superadmin) return children;

  if (manage_user_type && can_manage_user_types[createdByType]) {
    const allowedActions = can_manage_user_types[createdByType];
    if (allowedActions.includes(action)) {
      return children;
    } else {
      return fallback;
    }
  }

  return children;
};

export default ManageByCreatorPermission;
