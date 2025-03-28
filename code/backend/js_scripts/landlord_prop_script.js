$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    $('#userId').val(userId);
  
    function fetchProperties() {
      $.ajax({
        url: `/properties/${userId}`,
        method: 'GET',
        success: (data) => {
          const tableBody = $('#propertyTable tbody');
          tableBody.empty();
          data.forEach((property) => {
            tableBody.append(`
              <tr>
                <td>${property.property_id}</td>
                <td>${property.property_value}</td>
                <td>${property.address}</td>
                <td>${property.type}</td>
                <td>${property.size}</td>
                <td>${property.no_prev_residents}</td>
                <td>${property.LandLord_landlord_id}</td>
                <td>
                  <button onclick="editProperty(${property.property_id})">Edit</button>
                  <button onclick="deleteProperty(${property.property_id})">Delete</button>
                </td>
              </tr>
            `);
          });
        },
        error: (err) => {
          console.error('Error fetching properties:', err);
          alert('Failed to fetch properties.');
        },
      });
    }
  
    $('#addPropertyForm').submit(function (e) {
      e.preventDefault();
      const propertyData = {
        property_value: $('#propertyValue').val(),
        address: $('#propertyAddress').val(),
        type: $('#propertyType').val(),
        size: $('#propertySize').val(),
        no_prev_residents: $('#noPrevResidents').val(),
      };
      const userId = $('#userId').val(); 
      $.ajax({
        url: `/properties/${userId}`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(propertyData),
        success: () => {
          $('#addPropertyForm')[0].reset();
          fetchProperties();
        },
        error: (err) => {
          console.error('Error adding property:', err);
          alert('Failed to add property.');
        },
      });
    });


window.editProperty = function (id) {
  const userId = $('#userId').val();
  const newValues = {
        property_value: prompt('Enter new property value:'),
        address: prompt('Enter new address:'),
        type: prompt('Enter new type:'),
        size: prompt('Enter new size:'),
        no_prev_residents: prompt('Enter new no. of previous residents:'),
      };
  
    $.ajax({
      url: `/properties/${userId}/${id}`, 
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify( newValues ),
      success: fetchProperties, 
      error: (err) => {
        console.error('Error updating property:', err);
        alert('Failed to update property.');
      },
    });
};


window.deleteProperty = function (id) {
  const userId = $('#userId').val(); 
  
  if (confirm('Are you sure you want to delete this property?')) {
    $.ajax({
      url: `/properties/${userId}/${id}`, 
      method: 'DELETE',
      success: fetchProperties,
      error: (err) => {
        console.error('Error deleting property:', err);
        alert('Failed to delete property.');
      },
    });
  }
};

  fetchProperties();
});
  