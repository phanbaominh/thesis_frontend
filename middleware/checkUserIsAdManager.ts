import { Middleware } from '@nuxt/types';
import { TypeUser } from '~/types/types';

const checkUserIsAdManager: Middleware = ({ $auth, $toast, redirect }) => {
  if ($auth.user && $auth.user.typeUser !== TypeUser.AdManager) {
    $toast.error("You don't have permission");
    redirect('/');
  }
  // Use context
};

export default checkUserIsAdManager;
