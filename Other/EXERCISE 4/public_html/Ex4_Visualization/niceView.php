<!-- tHERE IS NO NEED TO CHNAGE THE HTML MARKUP -->

<!DOCTYPE html>
<html>
<head>
<title>SAMPLE RETRIEVAL AND QUERIES </title>

<!--set some style properties::: -->

<link rel="preconnect" href="https://fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="css/dataStuff.css">
  <!-- get JQUERY -->
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <!-- the js (ours)-->
	  <script type= "text/javascript"  src = "js/DataPoint.js"></script>
  <script type= "text/javascript"  src = "js/client.js"></script>
</head>
<body>
<header>

<h1> PATTERNS AND SQLITE </h1>
<label for="query choice">Select from the drop-down which query to view:</label>
<!-- drop down link for choosing which query to run
NONE, ONE AND TWO HAVE ALREADY BEEN COMPLETED-->
<select class="css-select" name="queryChoice" id="queryChoice">
	<option value="default">None: ** DO NOT CHANGE ** </option>
  <option value="one">One: ** DO NOT CHANGE ** </option>
  <option value="two">Two: ** DO NOT CHANGE ** </option>
  <option value="three">Three</option>
  <option value="four">Four</option>
	<option value="five">Five</option>
	<option value="six">Six</option>
</select>
</header>
<div id="parent-wrapper">
  <div id = "childOne"></div>
	<h3 id = "Ex4_title"> TEST </h3>
</div>
<footer>nothing yet :)</footer>

</body>
</html>
