// // post request
// fetch('https://jsonplaceholder.typicode.com/posts', {
//     method: 'POST',
//     body: JSON.stringify({
//         title: 'foo',
//         body: 'bar',
//         userId: 1
//     }),
//     headers: {
//         'Content-type': 'application/json',
//     },
// })
// .then(result => result.json())
// .then(result => console.log(result)); 

// fetch('https://jsonplaceholder.typicode.com/posts', {
//     method: 'POST',
//     body: JSON.stringify({
//         title: 'umair',
//         body: 'gosal',
//         userId: 1
//     }),
//     headers: {
//         'Content-type': 'application/json',
//     },
// })
// .then(result => result.json())
// .then(result => console.log(result)); 


// // get request
// fetch('https://jsonplaceholder.typicode.com/posts/3')
// .then(result => result.json())
// .then(result => console.log(result));



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.post('/api/save-text', (req, res) => {
    const text = `${req.body.firstName} ${req.body.lastName}`;
    console.log(req.body);

    // Process the text (e.g., save it to a database)
    // Here, we'll just send a response back with a message
    console.log(`Received text: ${text}`);  
    res.json({ message: `Received text: ${text}` });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});






// client side
document.getElementById('inputForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        await sendData({ firstName, lastName });
    });

    async function sendData(data) {
        try {
            const response = await fetch('http://127.0.0.1:3000/api/save-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            console.log(response);
            const responseData = await response.json();
            console.log(responseData);
            document.getElementById('myDiv').innerText = responseData.message;
        } catch (error) {
            console.error(error);
        }
    }