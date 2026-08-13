import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { ChargerLocationService } from "../../../services/chargerLocationService/charger-location.service";
import { Router } from '@angular/router';
import { ChargerService } from 'src/app/services/chargerService/charger.service';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: "app-google",
  templateUrl: "google.component.html",
})
export class GoogleComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 30.2672; // Default latitude
  lng: number = -97.7431; // Default longitude
  errorMessage: any;
  chargerLocation: any[] = [];
  userRole: string | null = '';
  isRadXAdmin: boolean = false;
  isRadXModerator: boolean = false;
  isCompanyAdmin: boolean = false;
  isPartnerAdmin: boolean = false;
  isUserGroupAdmin: boolean = false;
  isUserRole: boolean = false;
  user_id: any;
  constructor(
    private chargerLocationService: ChargerLocationService,
    private chargerService: ChargerService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.initializeUserRole();
    this.locateUser();
  }

  // Handle user roles similar to your provided example
  initializeUserRole() {
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;
      // Switch case to handle user roles
      switch (this.userRole) {
        case 'RadX_Admin':
          this.isRadXAdmin = true;
          this.getLocationsByRole();
          break;
        case 'RADX_MODERATOR':
          this.isRadXModerator = true;
          this.getLocationsByRole();
          break;
        case 'COMPANY_ADMIN':
        case 'COMPANY_OPERATOR':
        case 'COMPANY_MODERATOR':
        case 'COMPANY_TECHNICAL_OPERATOR':
        case 'COMPANY_MAINTENANCE_SPECIALIST':
        case 'COMPANY_CALL_CENTER':
        case 'COMPANY_ANALYST':
          this.isCompanyAdmin = true;
          this.getLocationsByCompany(company_id);
          break;
        case 'USER':
        case 'COMPANY_USER':
        case 'SUPER_USER':
          this.isUserRole = true;
          this.getUserDetail(this.user_id);
          break;
        case 'USER_GROUP_ADMIN':
        case 'USER_GROUP_MODERATOR':
          this.isUserGroupAdmin = true;
          //this.getLocationsByCompany(company_id);
          this.getUserDetail(this.user_id);
          break;
        case 'USER_GROUP_USER':
          this.isUserRole = true;

          this.getUserDetail(this.user_id);
          //  this.getLocationsByCompany(company_id);
          break;
        case 'PARTNER_ADMIN':
        case 'PARTNER_MODERATOR':
          this.isPartnerAdmin = true;
          this.getLocationsByPartner(partner_id);
          break;
        default:
          console.error('Unknown user role:', this.userRole);
          this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      console.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
  }

  locateUser() {
    // Use Geolocation API to get user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.initializeMap(); // Initialize the map with the user's location
        },
        (error) => {
          console.error("Geolocation error:", error);
          this.initializeMap(); // Fallback to default location if geolocation fails
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      this.initializeMap(); // Fallback if geolocation is not supported
    }
  }
  getUserDetail(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        console.log("response.user.company_id", response.user.company_id)
        this.getLocationsByCompany(response.user.company_id);
        console.log("USER_GROUP_USER this.isUserRole, company_id", this.isUserRole)
      },
      error: (error) => {
        console.error('Error fetching User details:', error);
      }
    });
  }

 
  initializeMap() {
    this.map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoicmFkeHNocGsiLCJhIjoiY20wbmwxbjhoMGRndjJrc2J1OHQxbXh3ciJ9.yH-hYErWYsuQ9FWr07qHlw',
      container: 'map',
      style: this.style,
      zoom: 13, // Set zoom level for closer view on user's location
      center: [this.lng, this.lat],
    });

    this.map.on('load', () => {
      // Call role-specific location retrieval
      this.getLocationsByRole();
    });
  }


  getLocations() {
    this.chargerLocationService.getAllChargerLocations().subscribe(
      (data) => {
        this.chargerLocation = data.location;
        this.addLocationsToMap();
      },
      (error) => {
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }

  getLocationsByRole() {
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.isRadXAdmin || this.isRadXModerator) {
        this.getLocations(); // Get all locations if the user is an admin or moderator
      } else if (this.isCompanyAdmin) {
        this.getLocationsByCompany(company_id);
      } else if (this.isPartnerAdmin) {
        this.getLocationsByPartner(partner_id);
      }
    }
  }

  getLocationsByCompany(companyId: string) {
    this.chargerLocationService.getChargerLocationByCompany(companyId).subscribe(
      (data) => {
        this.chargerLocation = data.location;
        this.addLocationsToMap();
      },
      (error) => {
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }

  getLocationsByPartner(partnerId: string) {
    this.chargerLocationService.getChargerLocationByPartner(partnerId).subscribe(
      (data) => {
        this.chargerLocation = data.location;
        this.addLocationsToMap();
      },
      (error) => {
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }

  // addLocationsToMap() {
  //   if (!this.map || !this.chargerLocation.length) return;

  //   // Create GeoJSON features array from the API response
  //   const features: GeoJSON.Feature<GeoJSON.Point>[] = this.chargerLocation.map(location => ({
  //     type: 'Feature',
  //     geometry: {
  //       type: 'Point',
  //       coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)],
  //     },
  //     properties: {
  //       id: location.location_id,
  //       title: location.location_name,
  //       address: location.addres,
  //       city: location.city,
  //       country: location.country,
  //     },
  //   }));

  //   // Construct the GeoJSON object
  //   const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  //     type: 'FeatureCollection',
  //     features: features,
  //   };

  //   // Add the GeoJSON source to the map
  //   this.map.addSource('locations', {
  //     type: 'geojson',
  //     data: geoJsonData,
  //   });

  //   // Load a custom image for the markers
  //   this.map.loadImage('../assets/img/cpmappinavaible.png', (error, image) => {
  //     if (error) {
  //       console.error('Error loading pin image:', error);
  //       return;
  //     }

  //     // Add the custom image to the map
  //     if (this.map) {
  //       this.map.addImage('custom-pin', image as HTMLImageElement);

  //       // Add a layer to display the locations as symbols
  //       this.map.addLayer({
  //         id: 'locations-layer',
  //         type: 'symbol',
  //         source: 'locations',
  //         layout: {
  //           'icon-image': 'custom-pin', // Use the custom pin image
  //           'icon-size': 0.5, // Adjust the size of the pin
  //           'icon-allow-overlap': true, // Allow pins to overlap
  //           'text-field': ['get', 'title'], // Display location name as text
  //           'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
  //           'text-size': 12,
  //           'text-offset': [0, 1.2],
  //           'text-anchor': 'top',
  //         },
  //       });
  //     }
  //   });

  //   // Add a popup when clicking on a location
  //   this.map.on('click', 'locations-layer', (e) => {
  //     if (!e.features || !e.features.length) return;
  //     const coordinates = (e.features[0].geometry as GeoJSON.Point).coordinates.slice();
  //     const { title, address, city, country } = e.features[0].properties;

  //     new mapboxgl.Popup({ offset: 25 })
  //       .setLngLat(coordinates as [number, number])
  //       .setHTML(`<strong>${title}</strong><br>${address}<br>${city}, ${country}`)
  //       .addTo(this.map);
  //   });

  //   // Change the cursor to a pointer when over a location
  //   this.map.on('mouseenter', 'locations-layer', () => {
  //     this.map.getCanvas().style.cursor = 'pointer';
  //   });

  //   // Change it back when it leaves
  //   this.map.on('mouseleave', 'locations-layer', () => {
  //     this.map.getCanvas().style.cursor = '';
  //   });
  // }


  addLocationsToMap() {
    if (!this.map || !this.chargerLocation.length) return;

    this.map.loadImage('../assets/img/cpmappinoffline.png', (errorOffline, offlineImage) => {
      if (errorOffline) {
        console.error('Error loading offline pin image:', errorOffline);
        return;
      }

      this.map.loadImage('../assets/img/cpmappinavaible.png', (errorAvailable, availableImage) => {
        if (errorAvailable) {
          console.error('Error loading available pin image:', errorAvailable);
          return;
        }

        this.map.loadImage('../assets/img/cpmappbusy.png', (errorBusy, busyImage) => {
          if (errorBusy) {
            console.error('Error loading busy pin image:', errorBusy);
            return;
          }

          // Add images if not already added
          if (!this.map.hasImage('pin-offline')) {
            this.map.addImage('pin-offline', offlineImage as HTMLImageElement);
          }
          if (!this.map.hasImage('pin-available')) {
            this.map.addImage('pin-available', availableImage as HTMLImageElement);
          }
          if (!this.map.hasImage('pin-busy')) {
            this.map.addImage('pin-busy', busyImage as HTMLImageElement);
          }

          // this.chargerLocation.forEach(location => {
          //   this.chargerService.getChargerByLocation(location.location_id).subscribe(
          //     (response: any) => {
          //       const chargers = response?.charger || [];
          //       const chargersCount = chargers.length;
          //       const statuses = chargers.map(charger => charger.status);

          //       const allCharging = chargersCount > 0 && statuses.every(status => status === "Charging");
          //       const allOffline = chargersCount > 0 && statuses.every(status => 
          //         !["Available", "Charging", "Finished", "Preparing"].includes(status)
          //       );

          //       let pinType = 'pin-available';
          //       if (allCharging) pinType = 'pin-busy';
          //       else if (allOffline) pinType = 'pin-offline';

          //       const feature: GeoJSON.Feature<GeoJSON.Point> = {
          //         type: 'Feature',
          //         geometry: {
          //           type: 'Point',
          //           coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)],
          //         },
          //         properties: {
          //           id: location.location_id,
          //           title: location.location_name,
          //           address: location.addres,
          //           city: location.city,
          //           country: location.country,
          //           chargersCount,
          //           pinType,
          //         },
          //       };

          //       const source = this.map.getSource('locations') as mapboxgl.GeoJSONSource;
          //       if (source) {
          //         const data = source._data as GeoJSON.FeatureCollection<GeoJSON.Point>;
          //         data.features.push(feature);
          //         source.setData(data);
          //       } else {
          //         const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
          //           type: 'FeatureCollection',
          //           features: [feature],
          //         };

          //         this.map.addSource('locations', {
          //           type: 'geojson',
          //           data: geoJsonData,
          //         });

          //         this.map.addLayer({
          //           id: 'locations-layer',
          //           type: 'symbol',
          //           source: 'locations',
          //           layout: {
          //             'icon-image': ['get', 'pinType'],
          //             'icon-size': 0.5,
          //             'icon-allow-overlap': true,
          //             'text-field': ['get', 'title'],
          //             'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          //             'text-size': 12,
          //             'text-offset': [0, 1.2],
          //             'text-anchor': 'top',
          //           },
          //         });

          //         this.map.on('click', 'locations-layer', (e) => {
          //           if (!e.features?.length) return;
          //           const { coordinates } = e.features[0].geometry as GeoJSON.Point;
          //           const { title, address, city, country, chargersCount, id } = e.features[0].properties;

          //           const popupContent = `
          //             <strong>${title}</strong><br>
          //             ${address}<br>
          //             ${city}, ${country}<br>
          //             <strong>Number of chargers:</strong> ${chargersCount}<br>
          //             ${!this.isUserRole ? `<button type="button" class="btn btn-sm btn-neutral" id="show-more-${id}">Show More</button>` : ''}
          //           `;

          //           new mapboxgl.Popup({ offset: 25 })
          //             .setLngLat(coordinates as [number, number])
          //             .setHTML(popupContent)
          //             .addTo(this.map);

          //           setTimeout(() => {
          //             const button = document.getElementById(`show-more-${id}`);
          //             if (button) {
          //               button.addEventListener('click', () => {
          //                 this.router.navigate([`/assets/locations/${id}`]);
          //               });
          //             }
          //           }, 0);
          //         });

          //         this.map.on('mouseenter', 'locations-layer', () => {
          //           this.map.getCanvas().style.cursor = 'pointer';
          //         });
          //         this.map.on('mouseleave', 'locations-layer', () => {
          //           this.map.getCanvas().style.cursor = '';
          //         });
          //       }
          //     },
          //     (error) => {
          //       console.error(`Failed to fetch chargers for location ${location.location_id}:`, error);
          //     }
          //   );
          // });
          this.chargerLocation.forEach(location => {
            this.chargerService.getChargerByLocation(location.location_id).subscribe(
              (response: any) => {
                const chargers = response?.charger || [];

                // Filter chargers with is_public === 'true'
                const publicChargers = chargers.filter(
                  charger => charger.is_public === 'true' || charger.is_public === '1' || charger.is_public === true);
                const chargerNames = publicChargers.map(charger => charger.charger_name).join(', ');

                const chargersCount = publicChargers.length;

                // If no public chargers, skip this location
                if (chargersCount === 0) {
                  return;  // Skip adding this location to the map
                }

                const statuses = publicChargers.map(charger => charger.status);

                const allCharging = chargersCount > 0 && statuses.every(status => status === "Charging");
                const allOffline = chargersCount > 0 && statuses.every(status =>
                  !["Available", "Charging", "Finished", "Preparing"].includes(status)
                );

                let pinType = 'pin-available';
                if (allCharging) pinType = 'pin-busy';
                else if (allOffline) pinType = 'pin-offline';

                const isRoaming = location.is_roaming === true;
                const roamingCompanyName = location.Company?.company_name || '';
                const feature: GeoJSON.Feature<GeoJSON.Point> = {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)],
                  },
                  properties: {
                    id: location.location_id,
                    title: location.location_name,
                    address: location.addres,
                    city: location.city,
                    country: location.country,
                    chargersCount,
                    chargerNames,
                    pinType,
                    isRoaming,
                    roamingCompanyName,
                  },
                };

                const source = this.map.getSource('locations') as mapboxgl.GeoJSONSource;
                if (source) {
                  const data = source._data as GeoJSON.FeatureCollection<GeoJSON.Point>;
                  data.features.push(feature);
                  source.setData(data);
                } else {
                  const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
                    type: 'FeatureCollection',
                    features: [feature],
                  };

                  this.map.addSource('locations', {
                    type: 'geojson',
                    data: geoJsonData,
                  });

                  // Halo behind roaming-partner locations so they're visually distinct.
                  this.map.addLayer({
                    id: 'roaming-halo',
                    type: 'circle',
                    source: 'locations',
                    filter: ['==', ['get', 'isRoaming'], true],
                    paint: {
                      'circle-radius': 18,
                      'circle-color': '#FFA500',
                      'circle-opacity': 0.35,
                      'circle-stroke-width': 2,
                      'circle-stroke-color': '#FF8C00',
                    },
                  });

                  this.map.addLayer({
                    id: 'locations-layer',
                    type: 'symbol',
                    source: 'locations',
                    layout: {
                      'icon-image': ['get', 'pinType'],
                      'icon-size': 0.5,
                      'icon-allow-overlap': true,
                      'text-field': ['get', 'title'],
                      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                      'text-size': 12,
                      'text-offset': [0, 1.2],
                      'text-anchor': 'top',
                    },
                  });

                  this.map.on('click', 'locations-layer', (e) => {
                    if (!e.features?.length) return;
                    const { coordinates } = e.features[0].geometry as GeoJSON.Point;
                    const { title, address, city, country, chargersCount, chargerNames, id, isRoaming, roamingCompanyName } = e.features[0].properties;

                    const roamingBadge = isRoaming
                      ? `<span style="display:inline-block;background:#FFA500;color:#fff;font-size:10px;font-weight:600;padding:2px 6px;border-radius:3px;margin-bottom:4px;">ROAMING${roamingCompanyName ? ' &middot; ' + roamingCompanyName : ''}</span><br>`
                      : '';
                    const popupContent = `
                            ${roamingBadge}<strong>${title}</strong><br>
                            ${address}<br>
                            ${city}, ${country}<br>
                            <strong>Number of chargers:</strong> ${chargersCount}<br>
                            <strong>Chargers:</strong> ${chargerNames}<br>
                            ${this.isCompanyAdmin ? `<button type="button" class="btn btn-sm btn-neutral" id="show-more-${id}">Show More</button>` : ''}
                          `;


                    new mapboxgl.Popup({ offset: 25 })
                      .setLngLat(coordinates as [number, number])
                      .setHTML(popupContent)
                      .addTo(this.map);

                    setTimeout(() => {
                      const button = document.getElementById(`show-more-${id}`);
                      if (button) {
                        button.addEventListener('click', () => {
                          this.router.navigate([`/assets/locations/${id}`]);
                        });
                      }
                    }, 0);
                  });

                  this.map.on('mouseenter', 'locations-layer', () => {
                    this.map.getCanvas().style.cursor = 'pointer';
                  });
                  this.map.on('mouseleave', 'locations-layer', () => {
                    this.map.getCanvas().style.cursor = '';
                  });
                }
              },
              (error) => {
                console.error(`Failed to fetch chargers for location ${location.location_id}:`, error);
              }
            );
          });

        });
      });
    });
  }


}
