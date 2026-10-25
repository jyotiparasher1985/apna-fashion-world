import axios from "axios";
import { API_BASE } from "../../api";
import { GETCARTREQ, POSTCARTREQ, POSTWISHLISTREQ } from "./action.Type";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const addToCart = (payload) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${API_BASE}/cart/add`,
      payload,
      authHeaders()
    );

    dispatch({ type: POSTCARTREQ, payload: response.data });
  } catch (err) {
    // console.log(err);
  }
};

const getCartData = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE}/cart/`, authHeaders());

    dispatch({ type: GETCARTREQ, payload: response.data });
  } catch (err) {
    // console.log(err);
  }

};

const addToWishlist = (payload) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_BASE}/wishlist/add`, payload);

    dispatch({ type: POSTWISHLISTREQ, payload: response.data });
  } catch (err) {
    // console.log(err);
  }
};

export { addToCart, addToWishlist, getCartData };
