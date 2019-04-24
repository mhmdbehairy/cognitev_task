/* -------------------------------------------------------------- */
// ROLES STRUCTURE:
/* -------------------------------------------------------------- */

/* const rolesStructure = {
    admin: {
        permissions: [
            { method: 'get', url: '/users' },
            { method: 'post', url: '/users' }
        ]
    },

    user: {
        permissions: [
            { method: 'get', url: '/users/:userId/articles', condition: (params, user) => { return user.id === params.userId } }
        ]
    },

    guest: {
        permissions: [
            { method: 'get', url: '/users' }
        ]
    }
}; */

/* -------------------------------------------------------------- */
// ACL :
/* -------------------------------------------------------------- */

class acl {

  static roles = {};
  static methods = ['get', 'post', 'put', 'delete', 'patch'];

  static createRole(role) {

    // Handle creating duplicate roles
    if (this.roles.hasOwnProperty(role))
      return console.log(`Role ${role} Already Exists!`);
    else
      this.roles[role] = { permissions: [] };

  };

};

/* -------------------------------------------------------------- */
// PERMISSION :
/* -------------------------------------------------------------- */

class Permission {

  constructor(role) {

    // Handle entering a role that does not exist
    if (!acl.roles.hasOwnProperty(role))
      return console.log(`Role ${role} Does Not Exist!`);
    else {
      this.role = role;
      this.permission = {};
    }

  };

  can = method => {

    //Handle entering an invalid action
    if (!acl.methods.includes(method))
      return console.log(`Method ${method} is Invalid!`);
    else {
      this.permission.method = method;
      return this;
    }

  };

  from = url => {
    this.permission.url = url;

    // Pushing the permission at this point at least ensures that no incomplete permissions are added to the list
    acl.roles[this.role].permissions.push(this.permission);
    return this;
  };

  to = this.from;

  when = condition => {
    this.permission.condition = condition;

    // Rollback the last permission added to add it again with a condition
    acl.roles[this.role].permissions.pop();
    acl.roles[this.role].permissions.push(this.permission);
    return this;
  };

};

const a = role => {
  return new Permission(role);
};

/* -------------------------------------------------------------- */
// CHECK :
/* -------------------------------------------------------------- */

class check {

  static if = role => {
    return new checkBuilder(role);
  }

}

class checkBuilder {

  output = false;
  condition = false;
  params = {};
  paramsName = '';
  paramsID = 0;
  permissionIndex = 0;

  constructor(role) {
    this.role = role;
  }

  can = method => {
    this.method = method;
    return this;
  }

  from = url => {
    this.url = url;
    this.checkInput();
    if (this.hasCondition)
      return this;
    else
      return console.log('Output: ' + this.output);
  }

  to = this.from;

  when = user => {
    acl.roles[this.role].permissions[this.permissionIndex].condition(this.params, user) ? this.output = true : null;
    return console.log('Output: ' + this.output);
  }

  checkInput = () => {
    if (!acl.roles.hasOwnProperty(this.role))
      return;

    acl.roles[this.role].permissions.forEach((permission, index) => {
      if (permission.method === this.method) {
        if (permission.url === this.url)
          this.output = true;
        else if (permission.url.includes(':')) {
          const a = this.url.split('/');
          const b = permission.url.split('/');
          if (a.length === b.length) {
            this.paramsID = parseInt(a[2]);
            this.paramsName = b[2].split(':')[1];
            this.params[this.paramsName] = this.paramsID;
            this.hasCondition = true;
            this.permissionIndex = index;
          }
        }
      }
    });

  }

}

/* -------------------------------------------------------------- */
// EXPORT :
/* -------------------------------------------------------------- */

export default acl;
export { a, a as an };
export { check };