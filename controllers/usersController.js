const fs = require("fs")

const users = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/users.json`
  )
)

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      users,
    },
  })
}

const getUserById = (req, res) => {
  const id = req.params.id * 1
  const user = users.find((el) => el.id === id)

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} this not found`,
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
}

const createUser = (req, res) => {
  console.log(req.body.role)
  // generate id untuk data baru dari request api kita
  const newId = users[users.length - 1]._id + 1
  const newData = Object.assign(
    { id: newId },
    req.body
  )

  users.push(newData)
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      // 201 = CREATED
      res.status(201).json({
        status: "success",
        data: {
          user: newData,
        },
      })
    }
  )
}

const editUser = (req, res) => {
  const id = req.params.id
  // findIndex = -1 (kalau data nya gk ada)
  const userIndex = users.findIndex(
    (el) => el._id === id
  )

  //   if (userIndex === -1) {
  //     return res.status(404).json({
  //       status: "failed",
  //       message: `data with ${id} this not found`,
  //     })
  //   }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `tour with this id ${id} edited`,
        data: {
          user: users[userIndex],
        },
      })
    }
  )
}

const removeUser = (req, res) => {
  // konversi string jadi number
  const id = req.params.id

  // cari index dari data yg sesuai id di req.params
  const userIndex = users.findIndex(
    (el) => el._id === id
  )

  // validasi kalau data yg sesuai req.params.id nya gak ada
  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: "data not found",
    })
  }

  // proses mengahpus data sesuai index array nya => req.params.id
  users.splice(userIndex, 1)

  // proses update di file json nya
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "berhasil delete data",
        data: null,
      })
    }
  )
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  removeUser,
}
