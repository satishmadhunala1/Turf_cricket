import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTurfById } from "../features/turfs/turfSlice";
import { createBooking } from "../features/bookings/bookingSlice";
import { handleStripePayment } from "../utils/stripe";
import Loader from "../components/Loader";
import Message from "../components/Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TurfDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [hours, setHours] = useState(1);

  const { turf, loading, error } = useSelector((state) => state.turfs);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading: loadingBooking } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getTurfById(id));
  }, [dispatch, id]);

  const calculateHours = (start, end) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let totalHours = endHour - startHour;
    let totalMinutes = endMinute - startMinute;

    if (totalMinutes < 0) {
      totalHours -= 1;
      totalMinutes += 60;
    }

    return totalHours + totalMinutes / 60;
  };

  const handleTimeChange = (type, value) => {
    if (type === "start") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }

    const calculatedHours = calculateHours(
      type === "start" ? value : startTime,
      type === "end" ? value : endTime
    );

    setHours(calculatedHours);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      navigate("/login");
      return;
    }

    const confirmed = window.confirm("You need to pay ₹300 as an advance. Continue?");
    if (!confirmed) return;

    const bookingData = {
      turf: id,
      bookingDate: bookingDate.toISOString().split("T")[0],
      startTime,
      endTime,
    };

    const result = await dispatch(createBooking(bookingData));

    if (createBooking.fulfilled.match(result)) {
      const booking = result.payload;

      await handleStripePayment({
        turfId: booking.turf,
        userId: booking.user,
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
    } else {
      alert("Booking failed: " + result.payload);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!turf) return <Message variant="info">Turf not found</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
            src={turf?.image || ""}
            alt={turf?.name || "Turf"}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{turf?.name}</h1>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Location:</span> {turf?.location}
          </p>
          <p className="text-green-700 font-bold text-xl mb-4">
            ₹{turf?.pricePerHour} / hour
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{turf?.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Facilities</h2>
            <ul className="grid grid-cols-2 gap-2">
              {(turf?.facilities || []).map((facility, idx) => (
                <li key={idx} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {facility}
                </li>
              ))}
              {turf?.facilities?.length === 0 && <li className="text-gray-500">No facilities listed</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Book This Turf</h2>

        <form onSubmit={handleBooking}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
              <DatePicker
                selected={bookingDate}
                onChange={(date) => setBookingDate(date)}
                minDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <select
                value={startTime}
                onChange={(e) => handleTimeChange("start", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                {Array.from({ length: 13 }, (_, i) => {
                  const hour = i + 8;
                  return `${hour.toString().padStart(2, "0")}:00`;
                }).map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <select
                value={endTime}
                onChange={(e) => handleTimeChange("end", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                {Array.from({ length: 13 }, (_, i) => {
                  const hour = i + 9;
                  return `${hour.toString().padStart(2, "0")}:00`;
                }).map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
              <input
                type="text"
                value={hours}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-xl font-bold">₹{(hours * (turf?.pricePerHour || 0)).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loadingBooking}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50"
            >
              {loadingBooking ? "Processing..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TurfDetailsPage;
