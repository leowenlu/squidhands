declare namespace USERS {
  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };
  type ChangePasswordParams = {
    username?: string;
    oldPassword?: string;
    newPassword?: string;
    autoLogin?: boolean;
    type?: string;
  };
  type CurrentUser = {
    name?: string;
    givenName?: string;
    familyName?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };
}