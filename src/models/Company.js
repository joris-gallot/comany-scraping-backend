export default class Company {
  constructor(name, description, siren, address, slug) {
    this.name = name;
    this.description = description;
    this.siren = siren;
    this.address = address;
    this.slug = slug;
  }

  toJson() {
    return {
      name: this.name,
      description: this.description,
      siren: this.siren,
      address: this.address,
      slug: this.slug,
    };
  }
}
