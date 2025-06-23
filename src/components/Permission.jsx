import { useSelector } from "react-redux";

  const Permission = ({ permission, children, fallback = null }) => {
  const { user_permissions = [], is_superadmin  } = useSelector((store) => store.auth);
  


  if (is_superadmin || user_permissions.includes(permission)) {
    return children;
  }

  return fallback;
  };

export default Permission;
