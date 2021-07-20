<template>
  <div>
    <h2>Login Form</h2>

    <form action="http://localhost:3030/authentication" method="POST">
      <div class="container">
        <input style="display: none" name="strategy" value="local" required />
        <label for="email">
          <b>Email</b>
        </label>
        <input type="text" placeholder="Enter email" name="email" required />

        <label for="password">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          required
        />

        <button type="submit">Login</button>
        <label>
          <input type="checkbox" checked="checked" name="remember" /> Remember
          me
        </label>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style>
html,
body {
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  height: 100%;
}

form {
  margin: auto;
  vertical-align: middle;
  max-width: 800px;
}

input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
}

button:hover {
  opacity: 0.8;
}

img.avatar {
  width: 40%;
  border-radius: 50%;
}

.container {
  padding: 16px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

span.password {
  float: right;
  padding-top: 16px;
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
  span.password {
    display: block;
    float: none;
  }

  .cancelbtn {
    width: 100%;
  }
}
</style>
