export default class Company {
  constructor(name, description, siren, address) {
    this.name = name;
    this.description = description;
    this.siren = siren;
    this.address = address;
  }

  toJson() {
    return {
      name: this.name,
      description: this.description,
      siren: this.siren,
      address: this.address,
    };
  }
}
