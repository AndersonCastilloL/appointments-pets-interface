import { BiCalendar } from "react-icons/bi";
import Search from "./Components/Search";
import AddAppointment from "./Components/AddAppointment";
import AppointmentInfo from "./Components/AppointmentInfo";
import { React, useState, useEffect, useCallback } from "react";

const App = () => {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");

  const fetchData = useCallback(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => setAppointmentList(data));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterAppointments = appointmentList
    .filter((item) => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      const order = orderBy === "asc" ? 1 : -1;
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order
        : 1 * order;
    });

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl">
        <BiCalendar className="inline-block text-red-400 align-top" /> Your
        Appointments
      </h1>
      <AddAppointment
        onSendAppointment={(myAppointment) =>
          setAppointmentList([...appointmentList, myAppointment])
        }
        lastId={appointmentList.reduce(
          (max, item) => (Number(item.id) > max ? Number(item.id) : max),
          0
        )}
      />
      <Search
        onQueryChange={(myQuery) => setQuery(myQuery)}
        query={query}
        orderBy={orderBy}
        onOrderByChange={(orderBy) => setOrderBy(orderBy)}
        sortBy={sortBy}
        onSortByChange={(mySort) => setSortBy(mySort)}
      />
      <ul className="divide-y divide-gray-200">
        {filterAppointments.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={(appointmentId) => {
              setAppointmentList(
                appointmentList.filter((a) => a.id !== appointmentId)
              );
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
