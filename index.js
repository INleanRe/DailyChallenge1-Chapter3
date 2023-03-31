const express = require('express');
// call express
const app = express();
const fs = require("fs");
const PORT = 3000;

app.use(express.json());

const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))


// how to get 101
// request, response

// app.get('/ppl', (req, res) => {
//     res.status(200).json({
//         status: "success",
//         data: {
//             persons: persons
//         }
//     })
// })

// get by parameter
app.get('/ppl/:id', (req, res) => {

    const id = req.params.id * 1;
    const person = persons.find(el => el.id === id )
    console.log(person)
    res.status(200).json({
        status: "success",
        data: {
            person
        }
    })
})

app.put("/ppl/:id", (req, res) => {
    const id = req.params.id * 1;
    const personIndex = persons.findIndex((el) => el.id === id);  
    const isValidName = req.body.name && req.body.name.length > 8;
  
    if (personIndex !== -1) {
      if (isValidName) {
        persons[personIndex] = { ...persons[personIndex], ...req.body };
        res.status(200).json({
          status: "success",
          message: `Data dengan id ${id} berhasil diubah`,
          data: persons[personIndex],
        });
        fs.writeFile(
          `${__dirname}/person.json`,
          JSON.stringify(persons),
          (errr) => {
            res.status(200).json({
              status: "success",
              message: `data dari id ${id} berhasil berubah`,
            });
          }
        );
      } else {
        res.status(400).json({
          status: "fail",
          message: `Nama kau pendek`,
        });
      }
    } else {
      res.status(404).json({
        status: "fail",
        message: `Data dengan id ${id} tidak ditemukan`,
      });
    }
  });

app.delete('/ppl/:id', (req, res) => {
    const id = req.params.id * 1;

    const index = persons.findIndex(element => element.id === id);
    const person = persons.find(el => el.id === id);

    if (!person) {
        res.status(400).json({
            status: 'failed',
            message: `person dengan id ${id} tersebut invalid`
        })
    } 

    if (index !== -1) {
        persons.splice(index, 1);
    }

    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(200).json({
                status: 'success',
                message: `data dari id ${id} nya berhasil dihapus`
            })
        }
    )
})



app.post('/ppl', (req, res) => {

    console.log(persons.length - 1)
    const newId = persons.length - 1 + 10;
    // object assign 
    const newPerson = Object.assign({ id: newId }, req.body)

    // write on json 
    persons.push(newPerson);
    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(201).json({
                status: 'success',
                data: {
                    person: newPerson
                }
            })
        }
    )
})
// start server
app.listen(PORT, ()=> {
    console.log(`App running on localhost ${PORT}`)
})

