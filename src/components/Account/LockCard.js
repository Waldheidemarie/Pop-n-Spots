import React from "react";
import { connect } from "react-redux";
import { fetchUser, fetchPops, getPops } from "../../store/user";
import { placesRef, userRef } from "../Firebase/firebase";
import { number } from "prop-types";
import {
  calculateDistanceMetrics,
  calculateDistance
} from "../../store/position";

class LockCard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      lockedPlaces: []
    };
    // current day abbreviation
    const date = new Date();
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    this.currentDay = days[date.getDay()];
    this.currentHour = date.getHours();
    this.bubbles = [
      "NewBubble00.png",
      "NewBubble33.png",
      "NewBubble66.png",
      "NewBubble99.png"
    ];
  }

  handleClick(location, address) {
    window.open(
      `http://maps.google.com/maps?saddr=${this.props.currentPosition.lat}+${
        this.props.currentPosition.lng
      }&daddr=${location},${address}`
    );
  }

  historyData = popData => {
    let popDataTarget = 0;
    if (popData) {
      const popDataCurrentDay = popData[this.currentDay];
      if (popDataCurrentDay) {
        for (let index = 0; index < popDataCurrentDay.length; index++) {
          const hour = popDataCurrentDay[index].hour;
          if (hour === this.currentHour) {
            popDataTarget = popDataCurrentDay[index].occupancyPercent;
          }
        }
      }
    }
    let popDataTargetFrame = 0;

    // we have chosen to adopt the following ranges for our bubbles
    // white -> 0 ... 10%
    // green -> 11% ... 50%
    // yellow -> 51% ... 75%
    // red -> 76% ... 100%

    if (0 < popDataTarget && popDataTarget <= 10) {
      popDataTargetFrame = 0;
    }
    if (10 < popDataTarget && popDataTarget <= 50) {
      popDataTargetFrame = 1;
    }
    if (50 < popDataTarget && popDataTarget <= 75) {
      popDataTargetFrame = 2;
    }
    if (75 < popDataTarget) {
      popDataTargetFrame = 3;
    }

    // safety check
    popDataTargetFrame = Math.max(popDataTargetFrame, 0);
    popDataTargetFrame = Math.min(popDataTargetFrame, this.bubbles.length - 1);

    return (
      <div className="pops-card-title-icon-container">
        <div> {`${popDataTarget}% Poppin`} </div>
        <img
          className="pops-card-title_icon"
          style={{ height: "30px", width: "30px" }}
          src={`${this.bubbles[popDataTargetFrame]}`}
        />
      </div>
    );
  };
  dropPlace(place) {
    const match = this.props.user.pops.find(
      user => user.placeKey === place.locationId
    );
    const popsRef = userRef
      .child(this.props.uID)
      .child("pops")
      .child(match.popIndex);
    popsRef.update({ locked: false });
  }

  componentDidMount(event) {
    this.props.fetchUser(this.props.uID);
    // this.props.fetchPops(this.props.user.pops)
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.count++;
      this.props.fetchPops(this.props.user.pops);
    }
  }

  locationData = address => {
    let result = address;
    let located = result.indexOf("Located");
    if (located !== -1) {
      result = result.slice(0, located);
    }
    let usa = result.indexOf(", USA");
    if (usa !== -1) {
      result = result.slice(0, usa);
    }
    let eua = result.indexOf(", EUA");
    if (eua !== -1) {
      result = result.slice(0, eua);
    }
    return result;
  };

  render() {
    console.log(`THE OBJECT===>`, this.props);
    if (this.props.user.pops !== undefined || this.props.pops.length !== 0) {
      const locks = this.props.user.pops.filter(pop => pop.locked);
      let result = this.props.pops.filter(o1 =>
        locks.some(o2 => o1.locationId === o2.placeKey)
      );
      return (
        <div>
          <div className="user-page-card">
            {result.map((places, index) => {
              return (
                <div className="pops-card" key={places.locationId}>
                  <div className="pops-card-title-container">
                    <div className="pops-card-title">{places.title}</div>
                    <div className="pops-card-title-icon">
                      {this.historyData(places.popularTimesHistogram)}
                    </div>
                  </div>
                  <ul className="pops-card-address-container">
                    <br />
                    <div className="pops-card-address">
                      {this.locationData(places.address)}
                    </div>
                    <div className="pops-card-phone">
                      {places.phone ? (
                        <div className="map-card-phone">
                          <a href="tel:{place.phone}">
                            {`${places.phone.slice(2, 5)}-${places.phone.slice(
                              5,
                              8
                            )}-${places.phone.slice(8)}`}
                          </a>
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                    <div className="pops-card-mile">
                      {`Distance : ${distanceText(
                        this.props.currentPosition,
                        places
                      )} miles`}
                    </div>
                    <div className="place-title">
                      {Array.from({ length: places.totalScore }).map((j, i) => (
                        <span className="stars" key={i}>
                          {" "}
                          🌟{" "}
                        </span>
                      ))}
                    </div>
                  </ul>
                  <div className="pops-card-buttons-container">
                    <button
                      className="pops-card-button"
                      type="button"
                      onClick={() => {
                        this.handleClick(places.title, places.address);
                      }}>
                      NAV
                    </button>
                    <button
                      className="pops-card-button-right"
                      type="button"
                      onClick={() => this.dropPlace(places)}>
                      DROP!
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="pops-card">
          {/* <div className="pops-card-title" /> */}
          <h5>You have no Saves Places....</h5>
        </div>
      );
    }
  }
}

const distanceText = (currentPosition, place) => {
  let result = calculateDistance(currentPosition, {
    lat: Number(place.gpsLat),
    lng: Number(place.gpsLong)
  });
  result = result / calculateDistanceMetrics.KM_PER_MILE;
  result = result.toFixed(1);
  return result;
};

const mapDispatchToProps = dispatch => ({
  fetchUser: uID => dispatch(fetchUser(uID)),
  fetchPops: places => dispatch(fetchPops(places))
});

const mapStateToProps = state => ({
  user: state.user.user,
  pops: state.user.pops,
  currentPosition: state.position.currentPosition
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockCard);
