var contactStore = (function () {
    let contactListString = localStorage.getItem("contactList");
    var contactList = contactListString ? JSON.parse(contactListString) : [];
  
    return {
      add: function (_name, _firstname, _date, _address, _email) {
        var contact = { name: _name, firstname: _firstname, date: _date, address: _address, email: _email };
        contactList.push(contact);
        localStorage.setItem("contactList", JSON.stringify(contactList));
      },
      reset: function () {
        contactList = [];
        localStorage.removeItem("contactList");
      },
      getList: function () {
        return contactList;
      },
    };
  })();
  