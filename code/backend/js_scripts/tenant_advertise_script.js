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
                  <td>${ad.property_id}</td>
                  <td>${ad.address}</td>
                  <td>${ad.size}</td>
                  <td>${ad.demanded_rent}</td>
                  <td>${ad.first_name}</td>
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
      
    fetchAdvertisements();
  });
  