import React from 'react';
import jump from 'jump.js';
import Card from './Card';
import Header from './Header';
import GoogleMap from './GoogleMap';
import data from './data/Data';
import { easeInOutCubic } from './utils/Easing';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      properties: data.properties,
      activeProperty: data.properties[0],
      filterIsVisible: false,
      // eslint-disable-next-line react/no-unused-state
      filterBedrooms: 'any',
      // eslint-disable-next-line react/no-unused-state
      filterBathrooms: 'any',
      filteredProperties: [],
      isFiltering: false,
    };

    this.setActiveProperty = this.setActiveProperty.bind(this);
  }

  setActiveProperty(property, scroll) {
    const { index } = property;

    this.setState({
      activeProperty: property,
    });

    if (scroll) {
      // scroll to the right property
      const target = `#card-${index}`;
      jump(target, {
        duration: 800,
        easing: easeInOutCubic,
      });
    }
  }

  toggleFilter = e => {
    const { filterIsVisible } = this.state;
    e.preventDefault();
    this.setState({
      filterIsVisible: !filterIsVisible,
    });
  };

  handleFilterChange = e => {
    const { value, name } = e.target;
    console.log(value, name);
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.filterProperties();
      }
    );
  };

  filterProperties = () => {
    const { properties, filterBedrooms, filterBathrooms } = this.state;
    const isFiltering = filterBedrooms !== 'any' || filterBathrooms !== 'any';

    // console.log(isFiltering, filterBedrooms);

    const getFilteredProperties = propertiesList => {
      const filteredProperties = propertiesList
        .filter(
          property =>
            property.bedrooms === parseInt(filterBedrooms) ||
            filterBedrooms === 'any'
        )
        .filter(
          property =>
            property.bathrooms === parseInt(filterBathrooms) ||
            filterBathrooms === 'any'
        );

      return filteredProperties;
    };

    this.setState({
      filteredProperties: getFilteredProperties(properties),
      activeProperty: getFilteredProperties(properties)[0],
      isFiltering,
    });
  };

  render() {
    const {
      properties,
      activeProperty,
      filterIsVisible,
      filteredProperties,
      isFiltering,
    } = this.state;

    const propertiesList = isFiltering ? filteredProperties : properties;

    return (
      <div>
        <div className="listings">
          <Header
            filterIsVisible={filterIsVisible}
            toggleFilter={this.toggleFilter}
            handleFilterChange={this.handleFilterChange}
          />

          <div className="cards container">
            <div className="cards-list row ">
              {propertiesList.map(property => (
                <Card
                  key={property._id}
                  property={property}
                  activeProperty={activeProperty}
                  setActiveProperty={this.setActiveProperty}
                />
              ))}
            </div>
          </div>
        </div>

        <GoogleMap
          properties={properties}
          activeProperty={activeProperty}
          setActiveProperty={this.setActiveProperty}
          filteredProperties={filteredProperties}
          isFiltering={isFiltering}
        />
      </div>
    );
  }
}

export default App;
