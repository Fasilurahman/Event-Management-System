import api from "../api/axiosInstance";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  price: number;
  judges: string[]; 
  food: string;     
  guests: string[]; 
}
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  price: number;
  judges: string[]; 
  food: string;     
  guests: string[]; 
}



// Create Event
export const createEventService = async (eventData: Event): Promise<Event> => {
  try {
    // console.log("Creating event with data:", eventData);
    const response = await api.post('/api/events', eventData);
    const savedEvent = response.data.event;
    return {
      ...savedEvent,
      id: savedEvent._id || savedEvent.id,
    };
  } catch (error: any) {
    console.error("Error creating event:", error);
    throw new Error(error.response?.data?.message || "Failed to create event");
  }
};

export const getAllEvents = async () => {
  try {
    const response = await api.get('/api/events');
    return response.data; 
  } catch (error: any) {
    console.error("Error fetching events:", error);
    throw error.response?.data || error.message;
  }
};




export const updateEventService = async (id: string, eventData: Event): Promise<Event> => {
  try {
    const response = await api.put(`/api/events/${id}`, eventData);
    console.log(response.data,'1234567890')
    const updatedEvent = response.data.event;

    return {
      ...updatedEvent,
      id: updatedEvent._id || updatedEvent.id,
    };
  } catch (error: any) {
    console.error("Error updating event:", error);
    throw new Error(error.response?.data?.message || "Failed to update event");
  }
};

export const deleteEventService = async (eventId: string) => {
  return await api.delete(`/api/events/${eventId}`);
};

export const createCheckoutSessionService = async (eventId: string, stripe: any) => {
  try {
    const response = await api.post('/api/events/create-checkout-session', { eventId });
    console.log(eventId,'event id')
    const { sessionId } = response.data;

    await stripe?.redirectToCheckout({ sessionId });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    throw new Error(error.response?.data?.message || "Failed to create checkout session");
  }
};


