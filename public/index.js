const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function formActions(formid, type) {
  let id = document.getElementById(`BM_${formid}_id`).value;
  let title = document.getElementById(`BM_${formid}_title`).value;
  let description = document.getElementById(`BM_${formid}_description`).value;
  let url = document.getElementById(`BM_${formid}_url`).value;
  let rating = document.getElementById(`BM_${formid}_rating`).value;
  console.log(`Clicked in edit row button: ${id} | ${title}`);

  if (type == "edit") {
    console.log(`Clicked in edit row button: ${id} | ${title}`);
    updateBookmark(id, title, description, url, rating);
  } else if (type == "delete") {
    console.log(`Clicked in delete row button: ${id}`);
    deleteBookmark(id);
  } else if (type == "new") {
    console.log(`Clicked in new row button: ${title} | ${description}`);
    newBookmark(title, description, url, rating);
  } else {
    console.log("Not valid type on formActions");
  }
}

function fetchBookmarks(titleIn) {
  let results = document.querySelector(".resultsTable");

  // getall
  let url = "/bookmarks";
  if (titleIn) url = "/bookmark?title=" + titleIn;

  let settings = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((newBookmarks) => {
      results.innerHTML = "";
      console.log(newBookmarks);

      // Just trying new things
      for (let bm in newBookmarks) {
        bm = newBookmarks[bm];
        results.innerHTML += `
        <tr>
          <td><input class="form-control" readonly value="${bm.id}" id="BM_${bm.id}_id"></td>
          <td><input class="form-control" type="text" id="BM_${bm.id}_title" value="${bm.title}"></td>
          <td><input class="form-control" type="text" id="BM_${bm.id}_description" value="${bm.description}"></td>
          <td><input class="form-control" type="text" id="BM_${bm.id}_url" value="${bm.url}"></td>
          <td><input class="form-control" type="text" id="BM_${bm.id}_rating" value="${bm.rating}"></td>
          <td>
            <button class="btn" onclick="formActions('${bm.id}','edit')";">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn" onclick="formActions('${bm.id}','delete')";">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
      }

      // New one
      results.innerHTML += `
      <tr>
        <td><input class="form-control" readonly value="ADD NEW" id="BM_new_id"></td>
        <td><input class="form-control" type="text" id="BM_new_title" value=""></td>
        <td><input class="form-control" type="text" id="BM_new_description" value=""></td>
        <td><input class="form-control" type="text" id="BM_new_url" value=""></td>
        <td><input class="form-control" type="text" id="BM_new_rating" value=""></td>
        <td>
            <button class="btn" onclick="formActions('new','new')";">
              <i class="fas fa-plus"></i>
            </button>
        </td>
      </tr>
      `;
    })
    .catch((err) => {
      alert(err.message);
    });
}

function newBookmark(title, description, urlIn, rating) {
  let data = {
    title: title,
    description: description,
    url: urlIn,
    rating: Number(rating),
  };
  if (isNaN(data.rating)) {
    alert("Rating should be a number");
    return;
  }

  console.log(data);

  let url = "/bookmark";
  let settings = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, settings)
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((response) => {
      console.log(response);
      fetchBookmarks(response.title);
    })
    .catch((err) => {
      alert(err.message);
    });
}

function updateBookmark(id, title, description, urlIn, rating) {
  let data = {
    id: id,
    title: title,
    description: description,
    url: urlIn,
    rating: Number(rating),
  };
  console.log("Updating: " + data);

  let url = "/bookmark/" + id;
  let settings = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, settings)
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((response) => {
      console.log(response);
      fetchBookmarks(response.title);
    })
    .catch((err) => {
      alert(err.message);
    });
}

function deleteBookmark(id) {
  console.log("Deleting: " + id);

  let url = "/bookmark/" + id;
  let settings = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  fetch(url, settings)
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return "Done";
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((response) => {
      console.log(response);
      fetchBookmarks(null);
    })
    .catch((err) => {
      alert(err.message);
    });
}

function watchFormByTitle() {
  let titleForm = document.querySelector(".titleForm");

  titleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Clicked get button");
    fetchBookmarks(document.getElementById("searchBMTitle").value);
  });
}

function init() {
  // Get all
  fetchBookmarks(null);
  watchFormByTitle();
}

init();
