async function login() {
  const empid = document.getElementById("empid").value;
  const password = document.getElementById("password").value;

  const apiUrl = `https://script.googleusercontent.com/a/macros/grindlaysindia.com/echo?user_content_key=AehSKLi4l1Agr6lROwKLajUBPZ01tfPX_a0YIyrStm9kfrWLBE0040M6lX4SkUCa3SWQYrQbnHHmt3M3iuGLomASrkCSTWBB4xSUEoEXD7wLQtMZLNJHMXg3Rx8WAQUFaTYU4GSR8FE3pZArM9iMyKFOq6VvAQu0IBgRQU1RdF8AQqOvCP0elqCYMGvdw9BCKhLs2l4sfaJ7k9axGa7x3luuxgqRfI_eb1xFqKgu_x8k16y4QotT82PRC4OYqSyrNAz_dv0XWys2Fw_UcXlDajZ48zGYZeXF3080rMNoCPuXOkHlXm4NqcWv73Eq4vn8d79EUhfQ0GwrP25C24R0KaAIKRXKXZsKuQ&lib=Mppj6j3sovGx_9CJWF-GYipxHXOgmvvFb&empid=${empid}&password=${password}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.success) {
      localStorage.setItem("employee", JSON.stringify(data));
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("error").innerText = data.message;
    }
  } catch (err) {
    document.getElementById("error").innerText = "API error.";
  }
}
