/* -------------------------------------------------------------- */
// IMPORTS :
/* -------------------------------------------------------------- */

import acl from "./acl";
import { a, an } from './acl';
import { check } from './acl';

/* -------------------------------------------------------------- */
// CREATE ROLES :
/* -------------------------------------------------------------- */

acl.createRole('admin');
acl.createRole('user');
acl.createRole('guest');

/* -------------------------------------------------------------- */
// ADD PERMISSIONS :
/* -------------------------------------------------------------- */

an('admin').can('get').from('/users');
an('admin').can('post').to('/users');
a('guest').can('get').from('/articles');
a('user').can('post').to('/users/:userId/articles').when((params, user) => user.id === params.userId);

console.log(acl.roles);

/* -------------------------------------------------------------- */
// CHECK PERMISSIONS :
/* -------------------------------------------------------------- */

check.if('guest').can('post').to('/users'); // false
check.if('admin').can('post').to('/users'); // true
check.if('user').can('post').to('/users/10/articles').when({ id: 10 }); // true
check.if('user').can('post').to('/users/12/articles').when({ id: 12 }); // true
check.if('user').can('post').to('/users/13/articles').when({ id: 10 }); // false
check.if('user').can('post').to('/users/10/articles').when({ id: 14 }); // false

