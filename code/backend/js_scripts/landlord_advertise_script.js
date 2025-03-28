$(document).ready(function () {
    const userId = new URLSearchParams(window.location.search).get('userId');
    $('#userId').val(userId);
    function fetchAdvertisements() {
        $.ajax({
          url: `/advertisements/${userId}`,
          method: 'GET',
          success: (data) => {
            const tableBody = $('#advertisementTable tbody');
            tableBody.empty();
            data.forEach((ad) => {
              tableBody.append(`
                <tr>
                  <td>${ad.advertising_id}</td>
                  <td>${ad.advertising_expense}</td>
                  <td>${ad.status}</td>
                  <td>${ad.demanded_rent}</td>
                  <td>${ad.Property_property_id}</td>
                  <td>
                    <button onclick="editAdvertisement(${ad.advertising_id}, ${ad.advertising_expense}, '${ad.status}', ${ad.demanded_rent})">Edit</button>
                    <button onclick="deleteAdvertisement(${ad.advertising_id})">Delete</button>
                  </td>
                </tr>
              `);
            });
          },
          error: (err) => {
            console.error('Error fetching advertisements:', err);
            alert('Failed to fetch advertisements.');
          },
        });
      }
    
      $('#addAdvertisementForm').submit(function (e) {
        e.preventDefault();
      
        const advertisementData = {
          advertising_expense: $('#advertisementExpense').val(),
          status: $('#advertisementStatus').val(),
          demanded_rent: $('#demandedRent').val(),
          property_id: $('#propertySelect').val(),
        };
      
        $.ajax({
          url: `/advertisements/${userId}`,
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(advertisementData),
          success: () => {
            $('#addAdvertisementForm')[0].reset();
            fetchAdvertisements();
          },
          error: (err) => {
            console.error('Error adding advertisement:', err);
            alert('Failed to add advertisement.');
          },
        });
      });


      window.editAdvertisement = function (id) {
        const userId = $('#userId').val();
        const newvalues={  
           advertising_expense : prompt('Edit Advertisement Expense:'),
           status : prompt('Edit Advertisement Status:'),
           demanded_rent : prompt('Edit Demanded Rent:'),
        };
          $.ajax({
            url: `/advertisements/${userId}/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(newvalues),
            success: fetchAdvertisements,
            error: (err) => {
              console.error('Error updating advertisement:', err);
              alert('Failed to update advertisement.');
            },
          });
      };
      
      window.deleteAdvertisement = function (id) {
        const userId = $('#userId').val();
        if (confirm('Are you sure you want to delete this advertisement?')) {
          $.ajax({
            url: `/advertisements/${userId}/${id}`,
            method: 'DELETE',
            success: fetchAdvertisements,
            error: (err) => {
              console.error('Error deleting advertisement:', err);
              alert('Failed to delete advertisement.');
            },
          });
        }
      };

    fetchAdvertisements();
  });
  