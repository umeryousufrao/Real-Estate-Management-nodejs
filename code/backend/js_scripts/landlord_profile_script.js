$(document).ready(function () {
    const userId = new URLSearchParams(window.location.search).get('userId');
  
    function fetchProfile() {
      $.ajax({
        url: `/profile/${userId}`,
        method: 'GET',
        success: (data) => {
          const tableBody = $('#profileTable tbody');
          tableBody.empty(); 
  
          tableBody.append(`
            <tr>
              <td>${data.landlord_id}</td>
              <td>${data.first_name}</td>
              <td>${data.last_name}</td>
              <td>${data.cnic_no}</td>
              <td>${data.contact_no}</td>
              <td>${data.no_of_properties_owned}</td>
              <td>
                <button onclick="editProfile()">Edit</button>
              </td>
            </tr>
          `);
        },
        error: (err) => {
          console.error('Error fetching profile:', err);
          alert('Failed to fetch profile details.');
        },
      });
    }

    window.editProfile = function () {
      $('#editProfileModal').show(); 
      $.ajax({
        url: `/profile/${userId}`,
        method: 'GET',
        success: (data) => {
          $('#firstName').val(data.first_name);
          $('#lastName').val(data.last_name);
          $('#cnicNo').val(data.cnic_no);
          $('#contactNo').val(data.contact_no);
        },
        error: (err) => {
          console.error('Error loading profile data for edit:', err);
          alert('Failed to load profile data.');
        },
      });
    };
  
    $('#editProfileForm').submit(function (e) {
      e.preventDefault();
  
      const updatedProfile = {
        first_name: $('#firstName').val(),
        last_name: $('#lastName').val(),
        cnic_no: $('#cnicNo').val(),
        contact_no: $('#contactNo').val(),
      };
  
      $.ajax({
        url: `/profile/${userId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedProfile),
        success: () => {
          $('#editProfileModal').hide();
          fetchProfile();
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          alert('Failed to update profile.');
        },
      });
    });
  
    $('#cancelEdit').click(function () {
      $('#editProfileModal').hide();
    });
  
    fetchProfile();
  });
  