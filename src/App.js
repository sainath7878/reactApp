import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

export default function App() {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [toggleSaveBtn, setToggleSaveBtn] = useState(true);
  const [id, setId] = useState(0);
  //value after initial render
  useEffect(() => {
    (async function () {
      const { data } = await axios.get("/api/addresses/");
      setAddresses(data.addresses);
    })();
  }, []);

  //POST REQUEST  --- ADD THE ADDRESS
  const clickHandler = async () => {
    setErrMsg(false);
    try {
      setLoading(true);
      const { data, status } = await axios.post("/api/addresses", {
        address: { city: newAddress }
      });
      setLoading(false);
      // console.log("====>", data);
      // console.log(addresses);
      if (status === 201) {
        setAddresses([...addresses, data.address]);
        setNewAddress("");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      setErrMsg(true);
    }
  };

  //DELETE THE ADDRESS
  const btnDeleteHandler = async (e) => {
    const id = e.target.value;
    try {
      await axios.delete(`/api/addresses/${id}`);
      // console.log(del);
      const addressList = addresses.filter((item) => !(item.id === id));
      setAddresses(addressList);
    } catch (err) {
      console.log(err);
    }
  };

  // EDIT THE ADDRESS
  const editHandler = async (city, id) => {
    setNewAddress(city);
    setToggleSaveBtn(false);
    setId(id);
  };

  const btnEditHandler = async () => {
    try {
      setLoading(true);
      const { data, status } = await axios.put(`/api/addresses/${id}`, {
        address: { city: newAddress }
      });
      setLoading(false);
      console.log("====>", data);
      console.log("====>", status);
      console.log(addresses);
      if (status === 200) {
        const updatedList = addresses.map((address) =>
          address.id === id ? { ...address, city: data.address.city } : address
        );
        setAddresses(updatedList);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      setErrMsg(true);
    } finally {
      setToggleSaveBtn(true);
      setNewAddress("");
    }
  };

  return (
    <div className="App">
      <h1> address book </h1>
      <input
        type="text"
        value={newAddress}
        placeholder="enter city"
        onChange={(event) => {
          const { value } = event.target;
          setNewAddress(value);
        }}
      />

      {toggleSaveBtn ? (
        <button onClick={clickHandler}> Save Address </button>
      ) : (
        <button onClick={btnEditHandler}>Save Edit </button>
      )}

      <p className="success">{loading && `Saving to Server...`}</p>
      <p className="failure">{errMsg && `"Alas! couldn't save the data"...`}</p>
      <ul>
        {addresses.map((address) => (
          <li key={address.id}>
            {address.city}
            <button
              className="edit"
              onClick={() => editHandler(address.city, address.id)}
            >
              Edit
            </button>
            <button
              className="delete"
              value={address.id}
              onClick={btnDeleteHandler}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
